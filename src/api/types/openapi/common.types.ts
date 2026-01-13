import { formsRegex } from "@/configs/formsRegex.config.ts";
import z from "zod";

declare const __uuidBrand: unique symbol;
declare const __offsetDateTimeBrand: unique symbol;
declare const __emailBrand: unique symbol;

/** UUID string (OpenAPI format: uuid). */
type UUIDFromSchema = string & {
  readonly [__uuidBrand]?: true;
};
const UUID_SCHEMA = z
  .uuid("Invalid UUID format")
  .transform((s) => s as UUIDFromSchema);

export type UUID = z.infer<typeof UUID_SCHEMA>;

/** ISO-8601 date-time string (OpenAPI format: date-time). */
const OFFSET_DATE_TIME_SCHEMA = z
  .string()
  .refine((s) => formsRegex.serverYearRange.test(s), {
    message: "Invalid date-time format",
  })
  .transform((s) => s as OffsetDateTime);
export type OffsetDateTime = string & {
  readonly [__offsetDateTimeBrand]?: true;
};

/** Email */
type EmailFromSchema = string & { readonly [__emailBrand]?: true };
const EMAIL_SCHEMA = z
  .email("Invalid email format")
  .transform((s) => s as EmailFromSchema);
export type Email = z.infer<typeof EMAIL_SCHEMA>;
