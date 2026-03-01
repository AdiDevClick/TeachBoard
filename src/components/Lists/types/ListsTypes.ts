import type {
  ExtractItemType,
  MergeProvided,
  NonFunctionValue,
} from "@/utils/types/types.utils.ts";
import type { PropsWithChildren, ReactElement, ReactNode } from "react";

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
export type ChildrenMode<TItems, TOptionalValue> = Readonly<
  {
    /** Children ReactElement mode: cloneElement will inject item props */
    items: TItems;
    optional?: ListMapperOptionalInput<TItems, TOptionalValue>;
  } & PropsWithChildren
>;

export type ChildrenFunctionMode<TItems, TOptionalValue> = Readonly<{
  /** Children function mode: full type safety with render function */
  items: TItems;
  optional?: ListMapperOptionalInput<TItems, TOptionalValue>;
  children: (
    item: ListMapperItem<TItems>,
    index: number,
    optional: TOptionalValue,
  ) => ReactNode;
}>;

type BivariantCallback<TArgs extends unknown[], TResult> = {
  bivarianceHack: (...args: TArgs) => TResult;
}["bivarianceHack"];

export type ListMapperOptionalResolver<TItems, TOptional> = BivariantCallback<
  [item: ListMapperItem<TItems>, index: number],
  TOptional
>;

export type ListMapperOptionalInput<TItems, TOptional> =
  | NonFunctionValue<TOptional>
  | ListMapperOptionalResolver<TItems, TOptional>;

export type ListMapperOptionalValue<TOptionalInput> = TOptionalInput extends (
  ...args: unknown[]
) => infer R
  ? R
  : TOptionalInput;
