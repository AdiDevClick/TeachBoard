import type { AppModalNames } from "@/configs/app.config.ts";
import type { UniqueSet } from "@/utils/UniqueSet.ts";
import type { PreventDefaultAndStopPropagation } from "@/utils/types/types.utils.ts";

/**
 * Type for Dialog context
 */
export type DialogContextType = {
  isDialogOpen: (id: AppModalNames) => boolean;
  openDialog: (e: PreventDefaultAndStopPropagation, id: AppModalNames) => void;
  closeDialog: (
    e: PreventDefaultAndStopPropagation,
    id?: AppModalNames
  ) => void;
  onOpenChange: (id: AppModalNames) => void;
  closeAllDialogs: () => void;
  deleteRef: (id: AppModalNames) => void;
  setRef: (ref: HTMLElement | null) => void;
  observedRefs: UniqueSet<string, { element: HTMLElement | null }>;
  openedDialogs: AppModalNames[];
};
