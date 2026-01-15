import { formsRegex } from "@/configs/formsRegex.config.ts";
import z from "zod";

/**
 * UUID string (OpenAPI format: uuid).
 *
 * @example: "123e4567-e89b-12d3-a456-426614174000"
 */
export const UUID_SCHEMA = z.uuid("Invalid UUID format").brand<"UUID">();

export type UUID = z.infer<typeof UUID_SCHEMA>;

/**
 * ISO-8601 date-time string (OpenAPI format: date-time).
 *
 * @example: "2023-10-05T14:48:00.000Z"
 */
export const OFFSET_DATE_TIME_SCHEMA = z.iso
  .datetime()
  .brand<"OffsetDateTime">();
export type OffsetDateTime = z.infer<typeof OFFSET_DATE_TIME_SCHEMA>;

/**
 * Year range string in the format "YYYY-YYYY".
 *
 * @example: "2023-2024"
 */
export const YEAR_RANGE_SCHEMA = z
  .string()
  .refine((s) => formsRegex.serverYearRange.test(s), {
    message: "Invalid year range format",
  })
  .brand<"YearRange">();

export type YearRange = z.infer<typeof YEAR_RANGE_SCHEMA>;

/**
 * Email string (OpenAPI format: email).
 *
 * @example "user@example.com"
 */
export const EMAIL_SCHEMA = z.email("Invalid email format").brand<"Email">();
export type Email = z.infer<typeof EMAIL_SCHEMA>;

/**
 * Session token string.
 *
 * @example "abcdef1234567890"
 */
export const SESSION_TOKEN_SCHEMA = z
  .string()
  .regex(formsRegex.serverSessionToken, "Invalid session token")
  .brand<"SessionToken">();
export type SessionToken = z.infer<typeof SESSION_TOKEN_SCHEMA>;
