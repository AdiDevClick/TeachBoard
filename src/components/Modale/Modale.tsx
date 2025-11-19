import type {
  ModaleProps,
  ModalState,
} from "@/components/Modale/types/modale.types.ts";
import { Dialog, DialogContent } from "@/components/ui/dialog.tsx";
import { useDialog } from "@/hooks/contexts/useDialog.ts";
import { useUserEventListener } from "@/hooks/events/useUserEventListener";
import { wait } from "@/utils/utils.ts";
import "@css/Dialog.scss";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

/**
 * Modale component
 * In order to trigger the modale, simply call the `useDialog` hook and use its `openDialog` method with the corresponding modale name.
 *
 * @description Choose a name for your modale instance.
 * Note that a name can correspond to only one modale instance and can have its own styles.
 *
 * @param children - Content the modale will observe (e.g., trigger button)
 * @param modaleContent - Content to be displayed inside the modal content area
 * @param modaleName - Name for your modale instance.
 * !! IMPORTANT !! NAME IS MANDATORY AND SHOULD BE UNIQUE ACROSS YOUR APPLICATION.
 * @param onOpenChange - Function to handle changes in the open state if needed
 * @param onOpen - Boolean to control the open state of the modale externally
 * @param onNodeReady - Function that receives the modale content ref when it's ready (this helps avoid issues with forms inside modales)
 *
 * @example
 * ```tsx
 * const { setRef, observedRef } = useMutationObserver({});
 * return (<Modale
 *   modaleName="myUniqueModaleName"
 *   modaleContent={<div ref={setRef}>My Triggered Modale Content</div>}
 *   onNodeReady={observedRef}
 *   onOpen={myOptionalOverrideFunctionThatReturnsBoolean}
 *   onOpenChange={myOptionalOverrideFunctionThatHandlesOpenChange}
 * />)
 * <Button onClick={openDialog("myUniqueModaleName")}>Open Modale</Button>
 * ```
 */
export function Modale({
  children,
  modaleContent,
  modaleName,
  onNodeReady,
  onOpen,
  onOpenChange,
}: Readonly<ModaleProps>) {
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
    modaleName: "",
    isOpen: false,
    locationState: "",
    url: "",
    historyIdx: null!,
    isHandledByPopState: false,
    isHandledByUserEvent: false,
    userInput: null,
  });

  const className = `dialog__content dialog__content--${modaleName}`;
  const onOpenChangeHandler = onOpenChange ?? contextOnOpenChange;
  const isOpen = onOpen ?? isDialogOpen(modaleName);
  const modalURL = `/${modaleName}`;
  // User clicked a mouse button
  const mouseButton = userMouseEvent?.button;
  // Router believes current path
  const routerPath = location.pathname;
  // Actual browser path (seen by user)
  const currentLocation = globalThis.location.pathname;

  /**
   * @todo modale ouverte : forwardstate => ne fait rien
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
     * @description Modale is closed via back navigation-
     * Browser should handle the history change itself
     * and modale URL can still be in history for forward navigation.
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
    // Force close the modale if opened
    if (isDialogOpen(modaleName)) closeDialog(popStateEvent, modaleName);

    const userIsOnModalURL = currentLocation === modalURL;
    const userIsOnPreviousURL = currentLocation === modalState.previousUrl;
    const browserUrlIsDifferentThanRouter = currentLocation !== routerPath;
    const targetUrl = routerPath === modalState.previousUrl;
    const shouldGoBack =
      userIsOnModalURL && browserUrlIsDifferentThanRouter && targetUrl;

    // Case 1 : user closes modale with a click on close cross or outside the modale
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
          modaleName,
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
      onOpenChange={() => onOpenChangeHandler(modaleName)}
    >
      {children}
      <DialogContent className={className}>{modaleContent}</DialogContent>
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
