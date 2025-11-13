import type { ElementType, ReactElement, ReactNode } from "react";

/**
 * Metadata injected by ListMapper when used with a component child
 */
export type ListMapperInjectedMeta<T, TOptional = undefined> = {
  index: number;
  __mapped: true;
} & T &
  (TOptional extends Record<string, unknown> ? TOptional : object);

/**
 * Type for children that will receive mapped props
 * All item props and optional props are injected, making them available but not required
 */
export type ListMapperPartialChildrenObject<T, TOptional = undefined> =
  | ReactElement<Partial<ListMapperInjectedMeta<T, TOptional>>>
  | ReactElement;

/**
 * Extract the item type from items array or object
 */
type ExtractItemType<TItems> = TItems extends Array<infer T>
  ? T
  : TItems extends Record<string, infer T>
  ? [string, T]
  : never;

/**
 * Props for the ListMapper component
 * Supports two mutually exclusive modes:
 * - component mode: render the provided component per item
 * - children mode: render function or element to be cloned
 */
export type ListMapperProps<TItems, TOptional = undefined> =
  | {
      items: TItems;
      optional: TOptional;
      components: ElementType;
      children?: never;
    }
  | {
      items: TItems;
      optional?: TOptional;
      components?: never;
      children:
        | ListMapperPartialChildrenObject<ExtractItemType<TItems>, TOptional>
        | ((
            item: ExtractItemType<TItems>,
            index: number,
            optional: TOptional
          ) => ReactNode);
    };
