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
} & T &
  TOptional;

/**
 * Type for children that will receive mapped props
 * All item props and optional props are injected, making them available but not required
 */
export type ListMapperPartialChildrenObject<T, TOptional = undefined> =
  | ReactElement<Partial<ListMapperInjectedMeta<T, TOptional>>>
  | ReactElement;

/**
 * Props for the ListMapper component
 * Supports two mutually exclusive modes:
 * - component mode: render the provided component per item
 * - children mode: render function or element to be cloned
 */
export type ListMapperProps<
  TItems,
  C extends ElementType,
  TOptional = undefined
> =
  | ({
      /** Component mode: requires an array of object items */
      items: TItems;
      // items: TItems & ReadonlyArray<ExtractItemType<TItems>>;
      optional?: TOptional;
      component: C;
      children?: never;
    } & MissingRequiredProps<
      ComponentProps<C>,
      MergeProvided<ExtractItemType<TItems>, TOptional>
    > &
      Partial<
        RemainingProps<
          ComponentProps<C>,
          MergeProvided<ExtractItemType<TItems>, TOptional>
        >
      >)
  | {
      // | ({
      //     /** Component mode: requires an array of object items */
      //     items: TItems;
      //     // items: TItems & ReadonlyArray<ExtractItemType<TItems>>;
      //     optional?: TOptional;
      //     component: C;
      //     children?: never;
      //   } & MissingRequiredProps<
      //     ComponentPropsWithoutRef<C>,
      //     MergeProvided<ExtractItemType<TItems>, TOptional>
      //   > &
      //     Partial<
      //       RemainingProps<
      //         ComponentPropsWithoutRef<C>,
      //         MergeProvided<ExtractItemType<TItems>, TOptional>
      //       >
      //     >)
      // | {
      /** Children mode: function or ReactElement that will receive injected props */
      items: TItems;
      optional?: TOptional;
      component?: never;
      children:
        | ListMapperPartialChildrenObject<TItems, TOptional>
        | ((
            item: ExtractItemType<TItems>,
            index: number,
            optional: TOptional
          ) => ReactNode);
      // children:
      //   | ListMapperPartialChildrenObject<ExtractItemType<TItems>, TOptional>
      //   | ((
      //       item: ExtractItemType<TItems>,
      //       index: number,
      //       optional: TOptional
      //     ) => ReactNode);
    };
