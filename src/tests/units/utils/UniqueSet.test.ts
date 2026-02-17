import { UniqueSet } from "@/utils/UniqueSet.ts";
import { describe, expect, it } from "vitest";

describe("UniqueSet - JSON serialization", () => {
  it("JSON.stringify() must serialize a UniqueSet to an array of values", () => {
    const set = new UniqueSet<string, { id: string; name: string }>();
    set.set("1", { id: "1", name: "A" }).set("2", { id: "2", name: "B" });

    const payload = { modules: set };
    const json = JSON.stringify(payload);

    const parsed = JSON.parse(json) as {
      modules: Array<{ id: string; name: string }>;
    };
    expect(Array.isArray(parsed.modules)).toBe(true);
    expect(parsed.modules).toEqual([
      { id: "1", name: "A" },
      { id: "2", name: "B" },
    ]);
  });

  it("Nested UniqueSet instances are serialized recursively", () => {
    const sub = new UniqueSet<string, { id: string; score: number }>();
    sub.set("s1", { id: "s1", score: 75 });

    const module = { id: "m1", name: "mod1", subSkills: sub };
    const modules = new UniqueSet<string, typeof module>();
    modules.set("m1", module);

    const json = JSON.stringify({ modules });
    const parsed = JSON.parse(json);

    expect(parsed.modules[0].subSkills).toEqual([{ id: "s1", score: 75 }]);
  });
});
