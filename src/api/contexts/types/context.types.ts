import type { AppDialFooterProps } from "@/components/Footer/types/footer.types.ts";
import type { HeaderTitleProps } from "@/components/Titles/types/titles.types.ts";
import type { Card, CardContent, CardFooter } from "@/components/ui/card.tsx";
import type { AppModalNames } from "@/configs/app.config.ts";
import type { UniqueSet } from "@/utils/UniqueSet.ts";
import type { PreventDefaultAndStopPropagation } from "@/utils/types/types.utils.ts";
import type { ComponentProps } from "react";

/**
 * Type for Dialog context
 */
export type DialogContextType = {
  isDialogOpen: (id: AppModalNames) => boolean;
  openDialog: (
    e: PreventDefaultAndStopPropagation,
    id: AppModalNames,
    options?: unknown,
  ) => void;
  closeDialog: (
    e: PreventDefaultAndStopPropagation,
    id?: AppModalNames,
  ) => void;
  onOpenChange: (id: AppModalNames) => void;
  dialogOptions: (dialog: AppModalNames) => unknown;
  dialogsOptions: Map<AppModalNames, unknown>;
  setDialogOptions: (id: AppModalNames, options: unknown) => void;
  closeAllDialogs: () => void;
  deleteRef: (id: AppModalNames) => void;
  setRef: (ref: Element | null) => void;
  observedRefs: UniqueSet<string, { element: Element | null }>;
  openedDialogs: AppModalNames[];
};

/**
 * Type for ViewCard context
 *
 * @remarks
 * This context uses the Compound Component pattern to manage the state and properties
 *
 * @property title - Properties for the header/title component of the card. ({@link DialogHeaderTitle} or {@link HeaderTitle})
 * @property content - Properties for the content component of the card.
 * @property footer - Properties for the footer component of the card, which can be either
 *                    AppDialFooterProps or CardFooter props.
 */
export type ViewCardContextType =
  | {
      card?: ComponentProps<typeof Card>;
      title?: HeaderTitleProps;
      content?: ComponentProps<typeof CardContent>;
      footer?: AppDialFooterProps | ComponentProps<typeof CardFooter>;
      modalMode?: boolean;
      pageId?: string;
      rest?: Record<string, unknown>;
    }
  | undefined;
