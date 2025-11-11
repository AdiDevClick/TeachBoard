import type { MouseEvent as ReactMouseEvent } from "react";
import { createContext } from "react";

export type DialogState = {
  isDialogOpen: boolean;
  container: HTMLDivElement | null;
};

export type DialogTriggerHandler = (
  event: ReactMouseEvent<HTMLElement>
) => void;

export type DialogOpenChangeHandler = (open: boolean) => void;

export type DialogContextType = {
  isDialogOpen: boolean;
  openDialog: () => void;
  closeDialog: () => void;
  onOpenChange: (open: boolean) => void;
};

/**
 * Context for Dialog component
 */
export const DialogContext = createContext<DialogContextType | undefined>(
  undefined
);
