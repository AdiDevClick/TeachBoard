import type { ApiError } from "@/types/AppErrorInterface.ts";
import type { ResponseInterface } from "@/types/AppResponseInterface.ts";
import type {
  ComponentType,
  ForwardRefExoticComponent,
  MouseEvent,
  ReactNode,
} from "react";

/**
 * Union of common event types where we want to call preventDefault/stopPropagation safely.
 */
export type PreventDefaultAndStopPropagation =
  | MouseEvent<HTMLElement>
  | undefined
  | null
  | Event;

/**
 * Tag props injected by ListMapper so they stay type-safe even when the original props are never.
 */
export type SafeListMapperProp<T extends Record<string, unknown>> = {
  ischild: true;
} & ExcludeProps<T>;

/**
 * Replace every property of T with an optional never to forbid consumers from passing them.
 */
export type ExcludeProps<T extends Record<string, unknown>> = {
  [K in keyof T]?: never;
};
/**
 * Merge two objects while defaulting non-object inputs to an empty object, avoiding conditional chains.
 */
export type MergeProvided<T, O> = (T extends object ? T : object) &
  (O extends Record<string, unknown> ? O : object);

/**
 * Collect keys that are required on T (not optional / undefined).
 */
export type RequiredKeys<T> = {
  [K in keyof T]-?: T extends Record<K, T[K]> ? K : never;
}[keyof T];

/**
 * Keys that are required on C but missing from Provided.
 */
export type MissingRequiredKeys<C, Provided> = Exclude<
  RequiredKeys<C>,
  keyof Provided
>;

/**
 * Shape describing the props that still need to be supplied because they were required but absent.
 */
export type MissingRequiredProps<C, Provided> = Pick<
  C,
  MissingRequiredKeys<C, Provided>
>;

/**
 * Remaining props after removing the keys already provided.
 */
export type RemainingProps<C, Provided> = Omit<C, keyof Provided>;

/**
 * Extract the element type from an array or the tuple [key, value] from a record.
 */
export type ExtractItemType<TItems> = TItems extends Array<infer T>
  ? T
  : TItems extends readonly (infer T)[]
  ? T
  : TItems extends Record<string, infer T>
  ? [string, T]
  : never;

/**
 * Extract React element props from an element-like type.
 */
export type ExtractPropsFromElement<T> = T extends { props: infer P }
  ? P
  : never;

/**
 * Generic bag of props to use when we intentionally fall back to an open shape.
 */
export type AnyProps = Record<string, unknown>;

/**
 * Strip string index signatures so only concrete string keys are preserved.
 */
export type OwnProps<T> = {
  [K in keyof T as K extends string
    ? string extends K
      ? never
      : K
    : never]: T[K];
};

/**
 * Union of component-like signatures (function, class, forwardRef, render prop).
 */
export type ComponentLike<P = unknown> =
  | ComponentType<P>
  | ForwardRefExoticComponent<P>
  | ((props: P) => ReactNode);

/**
 * Make a function type bivariant in its parameters.
 *
 * Useful for React callback props where callers may pass subtypes
 * (e.g. `DetailedCommandItem` where `CommandItemType` is expected).
 */
export type BivariantCallback<T extends (...args: any[]) => any> = {
  bivarianceHack(...args: Parameters<T>): ReturnType<T>;
}["bivarianceHack"];

/**
 * Replace the given prop S with inferred content props based on the provided component.
 */
export type EnsureContentProps<T, S extends string> = T extends {
  modalContent: infer C;
}
  ? C extends AnyComponentLike
    ? Omit<T, S> & { contentProps: ContentPropsFor<C> }
    : T
  : T;

/**
 * Enforce EnsureContentProps on every entry of a readonly tuple.
 */
export type EnsureContentList<
  T extends readonly unknown[],
  PropName extends string
> = T & { [K in keyof T]: EnsureContentProps<T[K], PropName> };

/**
 * Factory returning a strongly typed identity helper that validates content props for a list.
 */
export const createEnsureContentList =
  <PropName extends string>() =>
  <const T extends readonly unknown[]>(list: EnsureContentList<T, PropName>) =>
    list;

/**
 * Infer the props accepted by a ComponentLike.
 */
export type ComponentPropsOf<T> = T extends ComponentLike<infer P> ? P : never;

/**
 * Extract the props that should be forwarded to a component, excluding ref/children.
 */
export type ContentPropsFor<T extends ComponentLike<unknown>> = Omit<
  OwnProps<ComponentPropsOf<T>>,
  "ref" | "children"
>;

/**
 * ComponentLike that accepts any props, handy for config unions.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- Modal config must accept any component signature
export type AnyComponentLike = ComponentLike<any>;

type GenericSuccess<T extends ResponseInterface> = T;
type GenericError<T extends ApiError> = T;
