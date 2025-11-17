import type { ModaleProps } from "@/components/Modale/types/modale.types.ts";
import { Dialog, DialogContent } from "@/components/ui/dialog.tsx";
import { useDialog } from "@/hooks/contexts/useDialog.ts";
import { wait } from "@/utils/utils.ts";
import "@css/Dialog.scss";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

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
 */
export function Modale({
  children,
  modaleContent,
  modaleName,
  onNodeReady,
  onOpen,
  onOpenChange,
}: Readonly<ModaleProps>) {
  const location = useLocation();
  const navigate = useNavigate();
  const { isDialogOpen, onOpenChange: contextOnOpenChange } = useDialog();

  const [modalState, setModalState] = useState({
    forward: null! as boolean,
    isReady: false as HTMLElement | false,
    previousUrl: "",
    modaleName: "",
    isOpen: false,
    locationState: "",
    url: "",
  });

  const className = `dialog__content dialog__content--${modaleName}`;
  const onOpenChangeHandler = onOpenChange ?? contextOnOpenChange;

  const isOpen = onOpen ?? isDialogOpen(modaleName);
  const newUrl = `/${modaleName}`;

  /**
   * URL navigation effect
   */
  useEffect(() => {
    if (modalState.forward === null) return;

    if (modalState.forward) {
      const waitAndPush = async () => {
        await wait(100);
        history.pushState(modalState.previousUrl, "", newUrl);
      };
      waitAndPush();
    } else {
      navigate(modalState.previousUrl, {
        replace: true,
        state: {},
      });
    }
  }, [modalState.forward]);

  /**
   * Verify and set the onNodeReady element
   */
  useEffect(() => {
    if (onNodeReady && modalState.isReady !== onNodeReady) {
      setModalState((prev) => ({
        ...prev,
        isReady: onNodeReady ?? false,
      }));
    }
  }, [onNodeReady, modalState.isReady]);

  /**
   * Open/close state changes
   */
  useEffect(() => {
    if (!modalState.isReady) return;

    let stateObject = null;
    let forward = null;

    if (isOpen && !modalState.isOpen && location.pathname !== newUrl) {
      forward = true;
      stateObject = {
        isOpen: true,
        modaleName,
        previousUrl: location.pathname,
        url: newUrl,
      };
    }

    if (!isOpen && modalState.isOpen && modalState.previousUrl) {
      forward = false;
      stateObject = {
        isOpen: false,
        previousUrl: "",
        url: "",
      };
    }

    if (forward === null) return;

    setModalState((prev) => ({
      ...prev,
      ...stateObject,
      forward,
    }));
  }, [isOpen, location.pathname, modaleName, modalState.isReady]);

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
