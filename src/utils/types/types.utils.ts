import type { AppModal } from "@/pages/AllModals/types/modals.types";
import type { ApiError } from "@/types/AppErrorInterface.ts";
import type { ResponseInterface } from "@/types/AppResponseInterface.ts";
import type {
  ComponentType,
  ForwardRefExoticComponent,
  MouseEvent,
  ReactNode,
  SyntheticEvent,
} from "react";

/**
 * Types for general utilities and shared types across the application.
 */
export type AnimationsOptions = {
  incoming: {
    name: string;
    duration?: string;
    delay?: string;
  };
  outgoing: {
    name: string;
    duration?: string;
    delay?: string;
  };
};

/**
 * Union of common event types where we want to call preventDefault/stopPropagation safely.
 */
export type PreventDefaultAndStopPropagation =
  | MouseEvent<HTMLElement | SVGElement>
  | undefined
  | null
  | Event
  | SyntheticEvent<HTMLElement | SVGElement>;

/**
 * Tag props injected by ListMapper so they stay type-safe even when the original props are never.
 */
export type SafeListMapperProp<T extends AnyObjectProps> = {
  ischild: true;
} & ExcludeProps<T>;

/**
 * Replace every property of T with an optional never to forbid consumers from passing them.
 */
export type ExcludeProps<T extends AnyObjectProps> = {
  [K in keyof T]?: never;
};
/**
 * Merge two objects while defaulting non-object inputs to an empty object, avoiding conditional chains.
 */
export type MergeProvided<T, O> = (T extends object ? T : object) &
  (O extends AnyObjectProps ? O : object);

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
export type ExtractItemType<Items> = Items extends readonly (infer T)[]
  ? T
  : Items extends readonly (infer T)[]
    ? T
    : Items extends Record<string, infer T>
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
export type AnyObjectProps = Record<string, unknown>;

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
 * Helper type to extract only the non-function properties of a type, useful for distinguishing between value props and callback props in our HOCs.
 */
export type NonFunctionValue<T> = T extends (...args: unknown[]) => unknown
  ? never
  : T;
/**
 * Strict version of an object type that forbids any additional properties.
 *
 * This is useful for our HOCs where we want the wrapped component to reject
 * extra props even when the props are supplied via a variable (not just an
 * object literal).  The technique is to intersect the original type with a
 * mapped type that assigns `never` to any key that is not present on `T`.
 *
 * Example:
 * ```ts
 * type A = { x: number };
 * type B = NoExtraProps<A>;
 * const obj = { x: 1, y: 2 };
 * const a: B = obj; // error: 'y' is not allowed
 * ```
 */
export type NoExtraProps<T extends object> = T & {
  [K in Exclude<string, keyof T>]?: never;
};

export type KeysOfUnion<T> = T extends unknown ? keyof T : never;
export type ProvidedKeyRecord<T> = Record<KeysOfUnion<T>, unknown>;
export type HasStringIndex<T> = string extends keyof T ? true : false;

/**
 * Union of component-like signatures (function, class, forwardRef, render prop).
 */
export type ComponentLike<P = unknown> =
  | ComponentType<P>
  | ForwardRefExoticComponent<P>
  | BivariantCallback<(props: P) => ReactNode>;

/**
 * Make a function type bivariant in its parameters.
 *
 * Useful for React callback props where callers may pass subtypes
 * (e.g. `DetailedCommandItem` where `CommandItemType` is expected).
 */
export type BivariantCallback<T extends (...args: unknown[]) => any> = {
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
  PropName extends string,
> = T & { [K in keyof T]: EnsureContentProps<T[K], PropName> };

/**
 * Factory returning a strongly typed identity helper that validates content props for a list.
 */
export const createEnsureContentList =
  <PropName extends string>() =>
  <const T extends readonly AppModal[]>(list: EnsureContentList<T, PropName>) =>
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

/**
 * Result type for probeProxyKey function.
 */
export type ProbeProxyResult = {
  trapAvailable: boolean;
  isProxyfied: boolean;
  unsupported?: boolean;
};

/**
 * FOR TESTS ONLY: helper type to assert that a type is rejected by the compiler.
 */

// equality (used when we want two types to match exactly)
export type IsSame<A, B> = A extends B ? (B extends A ? true : false) : false;

/**
 * Useful for tests - Assert that A is assignable to B, but not the other way around.
 */
export type IsAssignable<A, B> = A extends B
  ? Exclude<
      keyof RemoveStringIndex<A>,
      keyof RemoveStringIndex<B>
    > extends never
    ? true
    : false
  : false;

/**
 * Useful for tests - Assert that A is assignable to B, but not the other way around.
 */
export type ShouldReject<A, B> =
  IsAssignable<A, B> extends true
    ? Exclude<
        keyof RemoveStringIndex<A>,
        keyof RemoveStringIndex<B>
      > extends never
      ? never
      : true
    : true;

// remove `string` index signature from a type – used both for the wrapped
// component's props and for our known metadata keys.

export type RemoveStringIndex<T> = {
  [K in keyof T as string extends K ? never : K]: T[K];
};

type _GenericSuccess<T extends ResponseInterface> = T;
type _GenericError<T extends ApiError> = T;
