import type {
  AppDialogOptions,
  DialogState,
} from "@/api/providers/DialogProvider";
import type { AppDialFooterProps } from "@/components/Footer/types/footer.types.ts";
import type { HeaderTitleProps } from "@/components/Titles/types/titles.types.ts";
import type { Card, CardContent, CardFooter } from "@/components/ui/card.tsx";
import type {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Separator } from "@/components/ui/separator";
import type { AppModalNames } from "@/configs/app.config.ts";
import type { UseMutationObserverReturn } from "@/hooks/types/use-mutation-observer.types";
import type {
  AnyObjectProps,
  PreventDefaultAndStopPropagation,
} from "@/utils/types/types.utils.ts";
import type { useSortable } from "@dnd-kit/sortable";
import type { ComponentProps } from "react";

/**
 * Type for Dialog context
 */
export type DialogContextType = {
  isDialogOpen: (id: AppModalNames) => boolean;
  openDialog: (
    e: PreventDefaultAndStopPropagation,
    id: AppModalNames,
    options?: AppDialogOptions,
  ) => void;
  closeDialog: (
    e: PreventDefaultAndStopPropagation,
    id?: AppModalNames,
  ) => void;
  onOpenChange: (id: AppModalNames) => void;
  dialogOptions: (dialog: AppModalNames) => AppDialogOptions | undefined;
  dialogsOptions: DialogState;
  setDialogOptions: (id: AppModalNames, options: AppDialogOptions) => void;
  closeAllDialogs: () => void;
  deleteRef: (id: AppModalNames) => void;
  // setRef: (ref: Element | null) => void;
  // observedRefs: UniqueSet<string, { element: Element | null }>;
  openedDialogs: AppModalNames[];
} & UseMutationObserverReturn;

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
      title?: TitleProps;
      content?: ComponentProps<typeof CardContent>;
      footer?: FooterProps;
      modalMode?: boolean;
      pageId?: string;
      rest?: Record<string, unknown>;
    }
  | undefined;

export type FooterProps = (
  | AppDialFooterProps
  | ComponentProps<typeof CardFooter>
) &
  SeparatorType;

export type TitleProps = HeaderTitleProps & SeparatorType;

type SeparatorType = {
  separator?: ComponentProps<typeof Separator> & { displaySeparator?: boolean };
};

/**
 * Context type for Dropdown Menu Layout, providing props for the DropdownMenu, DropdownMenuTrigger, and DropdownMenuContent components.
 */
export type DropdownMenuLayoutContextType<C> = {
  dropdown?: ComponentProps<typeof DropdownMenu>;
  trigger?: ComponentProps<typeof DropdownMenuTrigger>;
  content?: ComponentProps<typeof DropdownMenuContent>;
  rest?: C;
};

/**
 * Context type for Draggable Row, providing the necessary bindings (attributes and listeners) for making a table row draggable using the useSortable hook from @dnd-kit/sortable.
 */
export type DraggableRowBindingsContext = Readonly<
  Pick<ReturnType<typeof useSortable>, "attributes" | "listeners">
>;

/**
 * Type definition for the VerticalDrawer context, which includes properties for title, description, header, and content.
 */
export type VerticalDrawerContext = {
  title?: string;
  description?: string;
  header?: AnyObjectProps;
  content?: AnyObjectProps;
};
