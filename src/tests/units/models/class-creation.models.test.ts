import { classCreationSchema } from "@/features/class-creation/index.ts";
import { describe, expect, test } from "vitest";

describe("Class creation schema - schoolYear transform", () => {
  test("transforms '2024 - 2025' to '2024-2025' and validates", () => {
    const validPayload = {
      name: "2C",
      description: "Classe 2C",
      schoolYear: "2024 - 2025",
      degreeConfigId: "11111111-1111-4111-8111-111111111111",
      userId: "22222222-2222-4222-8222-222222222222",
      tasks: ["33333333-3333-4333-8333-333333333333"],
      students: ["44444444-4444-4444-8444-444444444444"],
    };

    const result = classCreationSchema.safeParse(validPayload);

    expect(result.success).toBe(true);

    // After transformation, schoolYear must be joined without spaces
    if (result.success) {
      expect(result.data.schoolYear).toBe("2024-2025");
    }

    // Fail safe test - After transformation, schoolYear must be joined without spaces
    if (result.success) {
      expect(result.data.schoolYear).not.toBe("2024 - 2025");
    }
  });

  test("rejects '2024-2025' (missing spaces for initial refine)", () => {
    const invalidPayload = {
      name: "2C",
      description: "Classe 2C",
      schoolYear: "2024-2025",
      degreeConfigId: "11111111-1111-4111-8111-111111111111",
      userId: "22222222-2222-4222-8222-222222222222",
      tasks: ["33333333-3333-4333-8333-333333333333"],
      students: ["44444444-4444-4444-8444-444444444444"],
    };

    const result = classCreationSchema.safeParse(invalidPayload);

    expect(result.success).toBe(false);
  });
});
