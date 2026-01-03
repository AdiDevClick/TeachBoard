declare const __uuidBrand: unique symbol;
declare const __offsetDateTimeBrand: unique symbol;

/** UUID string (OpenAPI format: uuid). */
export type UUID = string & { readonly [__uuidBrand]?: true };

/** ISO-8601 date-time string (OpenAPI format: date-time). */
export type OffsetDateTime = string & {
  readonly [__offsetDateTimeBrand]?: true;
};
