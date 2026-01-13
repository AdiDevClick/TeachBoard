import {
  EMAIL_SCHEMA,
  OFFSET_DATE_TIME_SCHEMA,
  SESSION_TOKEN_SCHEMA,
  UUID_SCHEMA,
  YEAR_RANGE_SCHEMA,
} from "@/api/types/openapi/common.types.ts";
import { describe, expect, test } from "vitest";

describe("common.types schemas", () => {
  test("UUID_SCHEMA: accepts valid UUID and rejects invalid", () => {
    const valid = UUID_SCHEMA.safeParse("123e4567-e89b-12d3-a456-426614174000");
    expect(valid.success).toBe(true);
    expect(valid.data).toBe("123e4567-e89b-12d3-a456-426614174000");

    const invalid = UUID_SCHEMA.safeParse("not-a-uuid");
    expect(invalid.success).toBe(false);
  });

  test("EMAIL_SCHEMA: accepts valid email and rejects invalid", () => {
    const ok = EMAIL_SCHEMA.safeParse("user@example.com");
    expect(ok.success).toBe(true);
    expect(ok.data).toBe("user@example.com");

    const bad = EMAIL_SCHEMA.safeParse("user@@");
    expect(bad.success).toBe(false);
  });

  test("YEAR_RANGE_SCHEMA: accepts valid year range and rejects invalid", () => {
    const ok = YEAR_RANGE_SCHEMA.safeParse("2023-2024");
    expect(ok.success).toBe(true);
    expect(ok.data).toBe("2023-2024");

    const bad = YEAR_RANGE_SCHEMA.safeParse("2023-24");
    expect(bad.success).toBe(false);

    const bad2 = YEAR_RANGE_SCHEMA.safeParse("abcd-efgh");
    expect(bad2.success).toBe(false);
  });

  test("OFFSET_DATE_TIME_SCHEMA: accepts ISO-8601 datetimes", () => {
    const ok = OFFSET_DATE_TIME_SCHEMA.safeParse("2023-10-05T14:48:00.000Z");
    expect(ok.success).toBe(true);
    expect(ok.data).toBe("2023-10-05T14:48:00.000Z");

    const bad = OFFSET_DATE_TIME_SCHEMA.safeParse("2023-10-05");
    expect(bad.success).toBe(false);
  });

  test("SESSION_TOKEN_SCHEMA: accepts expected server token format and rejects invalid", () => {
    // example 32-hex token used in the project
    const ok = SESSION_TOKEN_SCHEMA.safeParse(
      "2682dc7e6b3b0d08547106ebac94cee8"
    );
    expect(ok.success).toBe(true);
    expect(ok.data).toBe("2682dc7e6b3b0d08547106ebac94cee8");

    const bad = SESSION_TOKEN_SCHEMA.safeParse("shorttoken");
    expect(bad.success).toBe(false);
  });
});
