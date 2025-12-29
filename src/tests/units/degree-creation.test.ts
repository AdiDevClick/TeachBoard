import { diplomaFieldData } from "@/models/degree-creation.models.ts";

import { describe, expect, it } from "vitest";

describe("degree creation schema", () => {
  it("accepts names with spaces and accents", () => {
    const valid = {
      name: "Brevet Technique Supérieur",
      code: "BTS",
    };

    expect(() => diplomaFieldData.parse(valid)).not.toThrow();
  });
});
