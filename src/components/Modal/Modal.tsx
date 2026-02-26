import type {
  ModalProps,
  ModalState,
} from "@/components/Modal/types/modal.types.ts";
import { Dialog, DialogContent } from "@/components/ui/dialog.tsx";
import type { AppModalNames } from "@/configs/app.config";
import { useDialog } from "@/hooks/contexts/useDialog.ts";
import { useUserEventListener } from "@/hooks/events/useUserEventListener";
import type { ObserverRef } from "@/hooks/types/use-mutation-observer.types";
import { wait } from "@/utils/utils.ts";
import "@css/Dialog.scss";
import { useEffect, useEffectEvent, useState } from "react";
import { useLocation } from "react-router-dom";

const defaultModalState: ModalState = {
  forward: null,
  isReady: false,
  previousUrl: "",
  modalName: "",
  isOpen: false,
  locationState: "",
  url: "",
  historyIdx: null!,
  isHandledByPopState: false,
  isHandledByUserEvent: false,
  userInput: null,
};

/**
 * Modal component
 * In order to trigger the modal, simply call the `useDialog` hook and use its `openDialog` method with the corresponding modal name.
 *
 * @description Choose a name for your modal instance.
 * Note that a name can correspond to only one modal instance and can have its own styles.
 *
 * @param children - Content the modal will observe (e.g., trigger button)
 * @param modalContent - Content to be displayed inside the modal content area
 * @param modalName - Name for your modal instance.
 * !! IMPORTANT !! NAME IS MANDATORY AND SHOULD BE UNIQUE ACROSS YOUR APPLICATION.
 * @param onOpenChange - Function to handle changes in the open state if needed
 * @param onOpen - Boolean to control the open state of the modal externally
 *
 * @example
 * ```tsx
 * const { setRef, observedRefs } = useMutationObserver({});
 * return (<Modal
 *   modalName="myUniqueModalName"
 *   modalContent={<div ref={setRef}>My Triggered Modal Content</div>}
 *   onOpen={myOptionalOverrideFunctionThatReturnsBoolean}
 *   onOpenChange={myOptionalOverrideFunctionThatHandlesOpenChange}
 * />)
 * <Button onClick={openDialog("myUniqueModalName")}>Open Modal</Button>
 * ```
 */
export function Modal({
  children,
  modalContent,
  modalName,
  onOpen,
  onOpenChange,
  isNavigationModal = true,
}: ModalProps) {
  const { myEvent: popStateEvent } = useUserEventListener("popstate");
  const { myEvent: userMouseEvent } = useUserEventListener("pointerdown");
  const location = useLocation();
  const {
    isDialogOpen,
    onOpenChange: contextOnOpenChange,
    closeDialog,
    setRef,
    observedRefs,
  } = useDialog();

  const [modalState, setModalState] = useState(defaultModalState);

  const className = `dialog__content dialog__content--${modalName}`;
  const onOpenChangeHandler = onOpenChange ?? contextOnOpenChange;
  const isOpen = onOpen ?? isDialogOpen(modalName);
  const modalURL = `/${modalName}`;
  // User clicked a mouse button
  const mouseButton = userMouseEvent?.button;
  // Router believes current path
  const routerPath = location.pathname;
  // Actual browser path (seen by user)
  const currentLocation = globalThis.location.pathname;

  /**
   * @todo modal ouverte : forwardstate => ne fait rien
   */

  /**
   * USER NAVIGATION BY BROWSER BUTTONS
   *
   * This also handles mouse back/forward buttons.
   * @description Browser back/forward buttons or programmatically via pushState/replaceState.
   */
  const navigationTrigger = useEffectEvent(() => {
    let popState = null;

    /**
     * Case 1 : Normal Back -
     *
     * @description Modal is closed via back navigation-
     * Browser should handle the history change itself
     * and modal URL can still be in history for forward navigation.
     */
    if (!isOpen && modalState.isOpen && currentLocation !== modalURL) {
      popState = true;
    }

    /**
     * Case 2 : Normal Forward +
     *
     * @description Modal is opened via forward navigation +
     * Browser should handle the history change itself
     * and modal URL is now the current URL.
     */
    if (!modalState.isOpen && location.pathname === modalURL) {
      popState = false;
    }

    if (popState === null) return;
    setModalState((prev) => ({
      ...prev,
      isHandledByPopState: popState,
      isHandledByUserEvent: false,
    }));
  });

  /**
   * USER NAVIGATION BY BROWSER BUTTONS.
   *
   * @description This is triggered by a change in history state.
   */
  useEffect(() => {
    if (!popStateEvent) return;

    popStateEvent.preventDefault();
    navigationTrigger();
  }, [popStateEvent, modalState.isHandledByUserEvent]);

  /**
   * USER NAVIGATION BY MOUSE BUTTONS
   *
   * @description Keys can be handled here as well.
   * By default, Escape is handled by the Dialog component.
   *
   * Mouseback is also handled by the component but here we just track the event for navigation conflict issues handling.
   */
  const triggerMouseEvent = useEffectEvent((userMouseEvent: MouseEvent) => {
    if (!userMouseEvent?.button || !modalState.isOpen) return;

    userMouseEvent.preventDefault();

    let forward = null;
    let userInput = null;

    if (mouseButton === 3) {
      forward = false;
      userInput = "MouseBack";
    }

    if (mouseButton === 4) {
      forward = true;
      userInput = "MouseForward";
    }

    if (forward === null) return;

    setModalState((prev) => ({
      ...prev,
      forward,
      userInput,
      isHandledByUserEvent: true,
    }));
  });

  /**
   * User navigating via mouse buttons
   *
   * @description Each time a mouse button event is detected
   */
  useEffect(() => {
    triggerMouseEvent(userMouseEvent);
  }, [userMouseEvent]);

  /**
   * MODIFY HISTORY AND URL -
   *
   * @description Normal behaviour when no conflict between popstate and user events occurs.
   *
   * There should be no keys or popstate events handled here.
   */
  const historyModificationTrigger = useEffectEvent(
    (
      modalURL: string,
      popStateEvent: PopStateEvent | null,
      isStateOpened: boolean | null,
      isOpen: boolean | ((id: string) => boolean),
    ) => {
      const mouseInteraction = modalState.isHandledByUserEvent;

      if (
        isOpen ||
        isStateOpened === null ||
        !isStateOpened ||
        mouseInteraction
      )
        return;

      const stateObj = {
        ...history.state,
        forwardURL: modalURL,
      };
      // Force close the modal if opened
      if (isDialogOpen(modalName)) closeDialog(popStateEvent, modalName);

      const userIsOnModalURL = currentLocation === modalURL;
      // const userIsOnPreviousURL = currentLocation === modalState.previousUrl;
      const browserUrlIsDifferentThanRouter = currentLocation !== routerPath;
      const targetUrl = routerPath === modalState.previousUrl;
      const shouldGoBack =
        userIsOnModalURL && browserUrlIsDifferentThanRouter && targetUrl;

      // Case 1 : user closes modal with a click on close cross or outside the modal
      if (shouldGoBack) {
        history.back();
        waitAndReplace(stateObj, modalState.previousUrl);
      }

      if (!isStateOpened) return;
      setModalState((prev) => ({
        ...prev,
        forward: null,
        isOpen: false,
        previousUrl: "",
        url: "",
        historyIdx: history.state.idx,
        userInput: null,
        isHandledByUserEvent: false,
        isHandledByPopState: false,
      }));
    },
  );
  /**
   * MODIFY HISTORY AND URL
   *
   * @description Each time the modal open state changes
   */
  useEffect(() => {
    historyModificationTrigger(
      modalURL,
      popStateEvent,
      modalState.isOpen,
      isOpen,
    );
  }, [
    userMouseEvent,
    modalState.userInput,
    modalURL,
    popStateEvent,
    modalState.isOpen,
    isOpen,
  ]);

  /**
   * OPEN MODAL - Verify and set the open state
   *
   * @description This is triggered by a change in the open state.
   * It verifies if the modal can be opened and sets the URL.
   * The URL is only set if the modal is not already open to avoid conflicts with popstate and user events handling.
   */
  const openDialogTrigger = useEffectEvent(
    (
      isReady: boolean | HTMLElement,
      isOpen: boolean | ((id: string) => boolean),
    ) => {
      if (!isReady) return;

      let isModalOpened = null;
      const currentIndex = history.state?.idx;
      const currentPathLocation = location.pathname;

      if (isOpen && !modalState.isOpen) {
        isModalOpened = true;
        waitAndPush(
          {
            ...history.state,
            modalName,
            backgroundURL: currentPathLocation,
            actualURL: modalURL,
            ...popStateEvent?.state,
          },
          modalURL,
          10,
        );
      }

      if (!isOpen && modalState.isOpen && modalState.previousUrl) {
        isModalOpened = false;
      }

      if (isModalOpened === null) return;
      setModalState((prev) => ({
        ...prev,
        historyIdx: currentIndex,
        previousUrl: currentPathLocation,
        isOpen: isModalOpened,
        url: modalURL,
        isHandledByPopState: false,
        isHandledByUserEvent: false,
      }));
    },
  );

  /**
   * OPEN MODAL
   *
   * @description Each time the open state changes
   */
  useEffect(() => {
    openDialogTrigger(modalState.isReady, isOpen);
  }, [isOpen, modalState.isReady]);

  /**
   * INIT - Trigger verification
   *
   * @description Saves the ready element to be opened
   */
  const triggerVerification = useEffectEvent(
    (
      isReady: boolean | HTMLElement,
      observedRefs: ObserverRef,
      modalName: AppModalNames,
    ) => {
      if (observedRefs.size > 0) {
        const observedEntry = observedRefs.get(modalName);
        const observedElement =
          observedEntry?.element instanceof HTMLElement
            ? observedEntry.element
            : false;

        if (isReady !== observedElement) {
          setModalState((prev) => ({
            ...prev,
            isReady: observedElement,
          }));
        }
      }
    },
  );

  /**
   * INIT - Verify and set the observedRef element as ready to open the modal
   *
   * @description  Each time the observedRefs changes
   */
  useEffect(() => {
    if (!isNavigationModal || !observedRefs || !modalName) return;

    triggerVerification(modalState.isReady, observedRefs, modalName);
  }, [observedRefs, modalState.isReady, isNavigationModal, modalName]);

  return (
    <Dialog
      open={isOpen as boolean}
      onOpenChange={() => onOpenChangeHandler(modalName)}
    >
      {children}
      <DialogContent
        ref={(el) => setRef?.(el, { modalName })}
        id={modalName}
        data-dialog={modalName}
        className={className}
      >
        {modalContent}
      </DialogContent>
    </Dialog>
  );
}

/**
 * Waits for a specified duration and then pushes a new state to the browser history.
 * This function is useful for synchronizing URL changes with UI state transitions, such as opening modals.

 * @description This does not trigger a page reload.
 *
 * @param previousState - The state object or string representing the previous URL state
 * @param url - The URL to be pushed to the browser history
 * @param timer - The duration to wait before pushing the new state (default is 70 milliseconds)
 */
async function waitAndPush(state: object, url: string, timer = 70) {
  await wait(timer);
  history.pushState(state, "", url);
}
async function waitAndReplace(state: object, url: string, timer = 70) {
  await wait(timer);
  history.replaceState(state, "", url);
}
