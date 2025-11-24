import type {
  ModalProps,
  ModalState,
  WithSimpleAlertProps,
} from "@/components/Modal/types/modal.types.ts";
import { DialogHeaderTitle } from "@/components/Titles/ModalTitle.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Card } from "@/components/ui/card.tsx";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
} from "@/components/ui/dialog.tsx";
import { useDialog } from "@/hooks/contexts/useDialog.ts";
import { useUserEventListener } from "@/hooks/events/useUserEventListener";
import { wait } from "@/utils/utils.ts";
import "@css/Dialog.scss";
import { useEffect, useState, type ComponentType } from "react";
import { useLocation } from "react-router-dom";

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
 * @param onNodeReady - Function that receives the modal content ref when it's ready (this helps avoid issues with forms inside modals)
 *
 * @example
 * ```tsx
 * const { setRef, observedRef } = useMutationObserver({});
 * return (<Modal
 *   modalName="myUniqueModalName"
 *   modalContent={<div ref={setRef}>My Triggered Modal Content</div>}
 *   onNodeReady={observedRef}
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
  onNodeReady,
  onOpen,
  onOpenChange,
}: Readonly<ModalProps>) {
  const { myEvent: popStateEvent } = useUserEventListener("popstate");
  const { myEvent: userMouseEvent } = useUserEventListener("pointerdown");
  const location = useLocation();
  const {
    isDialogOpen,
    onOpenChange: contextOnOpenChange,
    closeDialog,
  } = useDialog();

  const [modalState, setModalState] = useState<ModalState>({
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
  });

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
   * User navigating via browser buttons.
   * This also handles mouse back/forward buttons.
   *
   * @description This is triggered by a change in history state.
   */
  useEffect(() => {
    if (!popStateEvent) return;

    popStateEvent.preventDefault();
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

    if (!modalState.isOpen && location.pathname === modalURL) {
      popState = false;
    }

    if (popState === null) return;
    setModalState((prev) => ({
      ...prev,
      isHandledByPopState: popState,
      isHandledByUserEvent: false,
    }));
  }, [popStateEvent, modalState.isHandledByUserEvent]);

  /**
   * User navigating via mouse buttons
   *
   * @description Keys can be handled here as well.
   * By default, Escape is handled by the Dialog component.
   *
   * Mouseback is also handled by the component but here we just track the event for navigation conflict issues handling.
   */
  useEffect(() => {
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
  }, [userMouseEvent]);

  /**
   * Modify history
   *
   * @description This section is for normal behaviour when no conflict between popstate and user events occurs.
   *
   * There should be no keys or popstate events handled here.
   */
  useEffect(() => {
    const mouseInteraction = modalState.isHandledByUserEvent;

    if (
      isOpen ||
      modalState.isOpen === null ||
      !modalState.isOpen ||
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
    const userIsOnPreviousURL = currentLocation === modalState.previousUrl;
    const browserUrlIsDifferentThanRouter = currentLocation !== routerPath;
    const targetUrl = routerPath === modalState.previousUrl;
    const shouldGoBack =
      userIsOnModalURL && browserUrlIsDifferentThanRouter && targetUrl;

    // Case 1 : user closes modal with a click on close cross or outside the modal
    if (shouldGoBack) {
      history.back();
      waitAndReplace(stateObj, modalState.previousUrl);
    }

    if (!modalState.isOpen) return;
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
  }, [
    userMouseEvent,
    modalState.userInput,
    modalURL,
    popStateEvent,
    modalState.isOpen,
    isOpen,
  ]);

  /**
   * Open state changes
   */
  useEffect(() => {
    if (!modalState.isReady) return;

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
        10
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
  }, [isOpen, modalState.isReady]);

  /**
   * Verify and set the onNodeReady element
   *
   * @description This is the init
   */
  useEffect(() => {
    if (onNodeReady && modalState.isReady !== onNodeReady) {
      setModalState((prev) => ({
        ...prev,
        isReady: onNodeReady ?? false,
      }));
    }
  }, [onNodeReady, modalState.isReady]);

  return (
    <Dialog
      open={isOpen as boolean}
      onOpenChange={() => onOpenChangeHandler(modalName)}
    >
      {children}
      <DialogContent className={className}>{modalContent}</DialogContent>
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

/**
 * Higher-order component to create a simple alert modal
 *
 * @description This contains a title, description and an Ok button to close the modal.
 */
export const WithSimpleAlert = withSimpleAlert(Modal);

function withSimpleAlert(WrappedComponent: ComponentType<ModalProps>) {
  return ({
    headerTitle,
    headerDescription,
    ref,
    ...rest
  }: WithSimpleAlertProps) => (
    <WrappedComponent
      {...rest}
      modalContent={
        <Card ref={ref}>
          <DialogHeaderTitle
            title={headerTitle}
            description={headerDescription}
          />
          <DialogFooter>
            <DialogClose asChild className="m-auto">
              <Button variant="outline">Ok</Button>
            </DialogClose>
          </DialogFooter>
        </Card>
      }
    />
  );
}
