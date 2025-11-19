import type { ApiError } from "@/types/AppErrorInterface.ts";
import type { ResponseInterface } from "@/types/AppResponseInterface.ts";
import type { MouseEvent } from "react";

/**
 * Utility types for type manipulations
 */
export type PreventDefaultAndStopPropagation =
  | MouseEvent<HTMLElement>
  | undefined
  | null
  | Event;

/**
 * Ensure you can use the ListMapper with props that have never type
 * (e.g. injected props from ListMapper)
 */
export type SafeListMapperProp<T extends Record<string, unknown>> = {
  ischild: true;
} & ExcludeProps<T>;

/** Utility type pour exclure automatiquement des props avec never */
export type ExcludeProps<T extends Record<string, unknown>> = {
  [K in keyof T]?: never;
};
export type MergeProvided<T, O> = (T extends object ? T : object) &
  (O extends Record<string, unknown> ? O : object);

export type RequiredKeys<T> = {
  [K in keyof T]-?: T extends Record<K, T[K]> ? K : never;
}[keyof T];

export type MissingRequiredKeys<C, Provided> = Exclude<
  RequiredKeys<C>,
  keyof Provided
>;

export type MissingRequiredProps<C, Provided> = Pick<
  C,
  MissingRequiredKeys<C, Provided>
>;

export type RemainingProps<C, Provided> = Omit<C, keyof Provided>;

/**
 * Extract the item type from items array or object
 */
export type ExtractItemType<TItems> = TItems extends Array<infer T>
  ? T
  : TItems extends Record<string, infer T>
  ? [string, T]
  : never;

/**
 * Extract props type from a ReactElement type
 */
export type ExtractPropsFromElement<T> = T extends { props: infer P }
  ? P
  : never;

type GenericSuccess<T extends ResponseInterface> = T;
type GenericError<T extends ApiError> = T;
