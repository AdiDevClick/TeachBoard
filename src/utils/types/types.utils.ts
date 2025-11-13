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
export type ExtractPropsFromElement<T> = T extends { props: infer P } ? P : never;
