import { createContext } from "react";
type DialogContextType = {
  isDialogOpen: boolean;
  openDialog: (isDialogOpen: boolean) => void;
};

/**
 * Context for Dialog component
 */
export const DialogContext = createContext<DialogContextType>(null!);
