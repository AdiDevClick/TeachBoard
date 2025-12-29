import type { AppDialFooterProps } from "@/components/Footer/types/footer.types.ts";
import type { HeaderTitleProps } from "@/components/Titles/types/titles.types.ts";
import type { CardFooter } from "@/components/ui/card.tsx";
import type { ComponentProps } from "react";

type BaseCardProps = {
  /** Optional page ID for the card component */
  pageId?: string;
  /** Props for the title/header component */
  titleProps?: HeaderTitleProps;
  /** Ref to be forwarded to the Card component */
  ref?: React.Ref<HTMLDivElement>;
};

/**
 * Case 1: Modal mode with footer (e.g., NewDegreeItem with modalMode=true literal)
 * @description Use when you need a modal-styled card with a footer containing form controls
 */
type ModalWithFooterProps<
  C extends object,
  F extends object
> = BaseCardProps & {
  modalMode: true;
  displayFooter?: true;
  footerProps: AppDialFooterProps;
} & C &
  F;

/**
 * Case 2: Dynamic mode with footer (e.g., NewDegreeItem with modalMode as boolean prop)
 * @description Use when modalMode is determined at runtime and needs a footer.
 * This allows the component to be invoked from outside with a dynamic modalMode value.
 */
type DynamicModeWithFooterProps<
  C extends object,
  F extends object
> = BaseCardProps & {
  modalMode: boolean;
  displayFooter?: boolean;
  footerProps: AppDialFooterProps & Partial<ComponentProps<typeof CardFooter>>;
} & C &
  F;

/**
 * Case 3: Card mode with optional footer
 * @description Use for standard card layouts where the footer is optional
 */
type CardWithOptionalFooterProps<
  C extends object,
  F extends object
> = BaseCardProps & {
  modalMode?: false;
  displayFooter?: boolean;
  footerProps?: ComponentProps<typeof CardFooter>;
} & C &
  Partial<F>;

/**
 * Case 4: No footer at all (e.g., LoginForm)
 * @description Use when the content manages its own footer or doesn't need one
 */
type NoFooterProps<C extends object> = BaseCardProps & {
  modalMode?: boolean;
  displayFooter: false;
  footerProps?: never;
} & C;

/**
 * Union type for all supported configurations
 */
export type WithTitledCardProps<C extends object, F extends object> =
  | DynamicModeWithFooterProps<C, F>
  | ModalWithFooterProps<C, F>
  | CardWithOptionalFooterProps<C, F>
  | NoFooterProps<C>;
