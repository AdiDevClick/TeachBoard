import type { AppModalNames } from "@/configs/app.config.ts";
import type { UniqueSet } from "@/utils/UniqueSet.ts";
import type { PreventDefaultAndStopPropagation } from "@/utils/types/types.utils.ts";

/**
 * Type for Dialog context
 */
export type DialogContextType = {
  isDialogOpen: (id: AppModalNames) => boolean;
  openDialog: (
    e: PreventDefaultAndStopPropagation,
    id: AppModalNames,
    options?: any
  ) => void;
  closeDialog: (
    e: PreventDefaultAndStopPropagation,
    id?: AppModalNames
  ) => void;
  onOpenChange: (id: AppModalNames) => void;
  dialogOptions: (dialog: AppModalNames) => any;
  dialogsOptions: Map<AppModalNames, any>;
  setDialogOptions: (id: AppModalNames, options: any) => void;
  closeAllDialogs: () => void;
  deleteRef: (id: AppModalNames) => void;
  setRef: (ref: Element | null) => void;
  observedRefs: UniqueSet<string, { element: Element | null }>;
  openedDialogs: AppModalNames[];
};
