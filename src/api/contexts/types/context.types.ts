/**
 * Type for Dialog context
 */
export type DialogContextType = {
  isDialogOpen: (id: string) => boolean;
  openDialog: (id: string) => void;
  closeDialog: (id?: string) => void;
  onOpenChange: (id: string) => void;
  closeAllDialogs: () => void;
};
