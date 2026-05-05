import type {
  AppDialogOptions,
  DialogState,
} from "@/api/providers/DialogProvider";
import type { AppDialFooterProps } from "@/components/Footer/types/footer.types.ts";
import type { HeaderTitleProps } from "@/components/Titles/types/titles.types.ts";
import type { Button } from "@/components/ui/button";
import type { Card, CardContent, CardFooter } from "@/components/ui/card.tsx";
import type {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import type {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Separator } from "@/components/ui/separator";
import type { AppModalNames } from "@/configs/app.config.ts";
import type { UseMutationObserverReturn } from "@/hooks/types/use-mutation-observer.types";
import type { PreventDefaultAndStopPropagation } from "@/utils/types/types.utils.ts";
import type { useSortable } from "@dnd-kit/sortable";
import type { ComponentProps, PropsWithChildren } from "react";

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
type VerticalDrawerLabel = {
  /**
   * The text label to be displayed on the drawer element, such as the title, description, or close button. This is a required property for any drawer element that needs to display text.
   */
  label: string;
};

type VerticalDrawerTitle = VerticalDrawerLabel &
  ComponentProps<typeof DrawerTitle>;
type VerticalDrawerDescription = VerticalDrawerLabel &
  ComponentProps<typeof DrawerDescription>;

export type VerticalDrawerHeaderProps = PropsWithChildren & {
  /**
   * Properties for the title of the drawer, which includes a label and any additional props that can be passed to the DrawerTitle component
   */
  drawerTitle?: VerticalDrawerTitle;
  /** Properties for the description of the drawer, which includes a label and any additional props that can be passed to the DrawerDescription component */
  drawerDescription?: VerticalDrawerDescription;
} & ComponentProps<typeof DrawerHeader>;

export type VerticalDrawerContentProps<T> = PropsWithChildren & Partial<T>;

export type VerticalDrawerFooterProps = PropsWithChildren & {
  /**
   * Properties for the close button in the drawer footer, which includes a label and any additional props that can be passed to the Button component
   */
  drawerClose?: VerticalDrawerLabel & ComponentProps<typeof Button>;
} & ComponentProps<typeof DrawerFooter>;

/**
 * Type definition for the VerticalDrawer context, which includes properties for title, description, header, and content.
 */
export type VerticalDrawerContext<T> = {
  /** Properties for the content of the drawer. */
  drawerContent?: VerticalDrawerContentProps<T>;
  /** Properties for the header of the drawer, including title and description.*/
  drawerHeader?: VerticalDrawerHeaderProps;
  /** Properties for the footer of the drawer, including a close button configuration. */
  drawerFooter?: VerticalDrawerFooterProps;
};

export type VerticalDrawerProps<T extends object> = PropsWithChildren &
  VerticalDrawerContext<T> &
  ComponentProps<typeof Drawer> & {
    /**
     * Properties for the content of the drawer.
     */
    drawerContentProps?: ComponentProps<typeof DrawerContent>;
  };
