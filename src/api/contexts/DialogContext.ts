import { createContext } from "react";

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
