import { formsRegex } from "@/configs/formsRegex.config.ts";
import z from "zod";

declare const __uuidBrand: unique symbol;
declare const __offsetDateTimeBrand: unique symbol;
declare const __emailBrand: unique symbol;
declare const __yearRangeBrand: unique symbol;
declare const __sessionTokenBrand: unique symbol;

/**
 * UUID string (OpenAPI format: uuid).
 *
 * @example: "123e4567-e89b-12d3-a456-426614174000"
 */
type UUIDFromSchema = string & {
  readonly [__uuidBrand]?: true;
};
export const UUID_SCHEMA = z
  .uuid("Invalid UUID format")
  .transform((s) => s as UUIDFromSchema);

export type UUID = z.infer<typeof UUID_SCHEMA>;

/**
 * ISO-8601 date-time string (OpenAPI format: date-time).
 *
 * @example: "2023-10-05T14:48:00.000Z"
 */
type OffsetDateTimeFromSchema = string & {
  readonly [__offsetDateTimeBrand]?: true;
};
export const OFFSET_DATE_TIME_SCHEMA = z.iso
  .datetime()
  .transform((s) => s as OffsetDateTimeFromSchema);
export type OffsetDateTime = z.infer<typeof OFFSET_DATE_TIME_SCHEMA>;

/**
 * Year range string in the format "YYYY-YYYY".
 *
 * @example: "2023-2024"
 */
type YearRangeFromSchema = string & { readonly [__yearRangeBrand]?: true };
export const YEAR_RANGE_SCHEMA = z
  .string()
  .refine((s) => formsRegex.serverYearRange.test(s), {
    message: "Invalid year range format",
  })
  .transform((s) => s as YearRangeFromSchema);

export type YearRange = z.infer<typeof YEAR_RANGE_SCHEMA>;

/**
 * Email string (OpenAPI format: email).
 *
 * @example "user@example.com"
 */
type EmailFromSchema = string & { readonly [__emailBrand]?: true };
export const EMAIL_SCHEMA = z
  .email("Invalid email format")
  .transform((s) => s as EmailFromSchema);
export type Email = z.infer<typeof EMAIL_SCHEMA>;

/**
 * Session token string.
 *
 * @example "abcdef1234567890"
 */
type SessionTokenFromSchema = string & {
  readonly [__sessionTokenBrand]?: true;
};
export const SESSION_TOKEN_SCHEMA = z
  .string()
  .regex(formsRegex.serverSessionToken, "Invalid session token")
  .transform((s) => s as SessionTokenFromSchema);
export type SessionToken = z.infer<typeof SESSION_TOKEN_SCHEMA>;
