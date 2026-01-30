import type {
  AnyObjectProps,
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

export type ListMapperItem<TItems> = ExtractItemType<TItems>;

export type ListMapperProvidedProps<TItems, TOptional> = MergeProvided<
  ListMapperItem<TItems>,
  TOptional
>;

export type ListMapperInjectedProps<TItems, TOptional> = ListMapperInjectedMeta<
  ListMapperItem<TItems>,
  TOptional
>;

type MakeOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type ListMapperChildProps<TItems, TOptional, P> = MakeOptional<
  P,
  Extract<keyof P, keyof ListMapperInjectedProps<TItems, TOptional>>
>;

/**
 * Type for children that will receive mapped props
 * All item props and optional props are injected, making them available but not required
 */
export type ListMapperPartialChildrenObject<
  T,
  TOptional = undefined,
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
  TOptionalInput = undefined,
  TChildProps extends AnyObjectProps = AnyObjectProps,
> =
  | ({
      /** Component mode: component receives item props automatically */
      items: TItems;
      optional?: TOptionalInput;
      component: C;
      children?: never;
    } & MissingRequiredProps<
      ComponentProps<C>,
      ListMapperProvidedProps<TItems, ListMapperOptionalValue<TOptionalInput>>
    > &
      Partial<
        RemainingProps<
          ComponentProps<C>,
          ListMapperProvidedProps<
            TItems,
            ListMapperOptionalValue<TOptionalInput>
          >
        >
      >)
  | {
      /** Children function mode: full type safety with render function */
      items: TItems;
      optional?: TOptionalInput;
      component?: never;
      children: (
        item: ListMapperItem<TItems>,
        index: number,
        optional: ListMapperOptionalValue<TOptionalInput>,
      ) => ReactNode;
    }
  | {
      /** Children ReactElement mode: cloneElement will inject item props */
      items: TItems;
      optional?: TOptionalInput;
      component?: never;
      children: ReactElement<
        ListMapperChildProps<
          TItems,
          ListMapperOptionalValue<TOptionalInput>,
          TChildProps
        >
      >;
    };

export type ListMapperOptionalResolver<TItems, TOptional> = (
  item: ListMapperItem<TItems>,
  index: number,
) => TOptional;

export type ListMapperOptionalInput<TItems, TOptional> =
  | TOptional
  | ListMapperOptionalResolver<TItems, TOptional>;

export type ListMapperOptionalValue<TOptionalInput> = TOptionalInput extends (
  ...args: unknown[]
) => infer R
  ? R
  : TOptionalInput;
