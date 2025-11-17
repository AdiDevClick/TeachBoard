import type { AppModalNames } from "@/configs/app.config.ts";

/**
 * Type for Dialog context
 */
export type DialogContextType = {
  isDialogOpen: (id: AppModalNames) => boolean;
  openDialog: (id: AppModalNames) => void;
  closeDialog: (id?: AppModalNames) => void;
  onOpenChange: (id: AppModalNames) => void;
  closeAllDialogs: () => void;
};
