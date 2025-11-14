import type {
  ExtractItemType,
  MergeProvided,
  MissingRequiredProps,
  RemainingProps,
} from "@/utils/types/types.utils.ts";
import type {
  ComponentProps,
  ElementType,
  ReactElement,
  ReactNode,
} from "react";

/**
 * Metadata injected only in children function / element clone modes (not component mode)
 */
export type ListMapperInjectedMeta<T, TOptional = undefined> = {
  index: number;
} & MergeProvided<T, TOptional>;

/**
 * Type for children that will receive mapped props
 * All item props and optional props are injected, making them available but not required
 */
export type ListMapperPartialChildrenObject<
  T,
  TOptional = undefined
> = ReactElement<Partial<ListMapperInjectedMeta<T, TOptional>>>;

/**
 * Props for the ListMapper component
 * Supports 3 mutually exclusive modes:
 * - component mode: render the provided component per item
 * - children function mode: render function with item, index, and optional props
 * - children mode: render function or element to be cloned
 */
export type ListMapperProps<
  TItems,
  C extends ElementType,
  TOptional extends Record<string, unknown> | undefined = undefined
> =
  | ({
      /** Component mode: component receives item props automatically */
      items: TItems;
      optional?: never;
      component: C;
      children?: never;
    } & MissingRequiredProps<ComponentProps<C>, ExtractItemType<TItems>> &
      Partial<RemainingProps<ComponentProps<C>, ExtractItemType<TItems>>>)
  | {
      /** Children function mode: full type safety with render function */
      items: TItems;
      optional?: TOptional;
      component?: never;
      children: (
        item: ExtractItemType<TItems>,
        index: number,
        optional: TOptional
      ) => ReactNode;
    }
  | {
      /** Children ReactElement mode: cloneElement will inject item props */
      items: TItems;
      optional?: TOptional;
      component?: never;
      children: ReactNode;
    };
