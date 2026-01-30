import { checkPropsValidity } from "@/utils/utils.ts";
import { describe, expect, it } from "vitest";

describe("checkPropsValidity / findMissingRequiredKeys behaviour", () => {
  it("Forbidden case - Returns true when forbidden keys are present", () => {
    const requires = ["extra"];
    const forbidden = ["form"];
    const props = { form: {}, name: "abc", extra: 1 };

    expect(checkPropsValidity(props, requires, forbidden)).toBe(true);
  });

  it("All is OK - Returns false when simple required keys are present", () => {
    const requires = ["form", "name"];
    const props = { form: {}, name: "abc", extra: 1 };

    expect(checkPropsValidity(props, requires, [])).toBe(false);
  });

  it("Missing required key - Returns true when a simple required key is missing", () => {
    const requires = ["form", "name"];
    const props = { form: {} };

    expect(checkPropsValidity(props, requires, [])).toBe(true);
  });

  it("Handles nested object requirement: item must have title and number", () => {
    const requires = [{ item: ["title", "number"] }] as unknown as string[];

    const propsOk = {
      item: { title: "t", number: 1 },
      other: 2,
    };
    expect(checkPropsValidity(propsOk, requires, [])).toBe(false);

    const propsMissing = { item: { title: "t" } };
    expect(checkPropsValidity(propsMissing, requires, [])).toBe(true);
  });

  it("Handles multi-nested requirement with item and item2", () => {
    const requires = [
      { item: ["title", "number"], item2: ["newTitle", "newNumber"] },
    ] as unknown as string[];

    const propsOk = {
      item: { title: "t", number: 1 },
      item2: { newTitle: "x", newNumber: 2 },
    };
    expect(checkPropsValidity(propsOk, requires, [])).toBe(false);

    const propsMissing = {
      item: { title: "t", number: 1 },
      item2: { newTitle: "x" },
    };
    expect(checkPropsValidity(propsMissing, requires, [])).toBe(true);
  });

  it("Handles hybrid requirement: nested item + top-level newTitle", () => {
    const requires = [{ item: ["title", "number"] }, "newTitle"] as string[];

    const propsOk = {
      item: { title: "t", number: 1 },
      newTitle: "ok",
    };
    expect(checkPropsValidity(propsOk, requires, [])).toBe(false);

    const propsMissing = {
      item: { title: "t", number: 1 },
    };
    expect(checkPropsValidity(propsMissing, requires, [])).toBe(true);
  });

  it("The expected nested structure should be OK if nested keys are strings instead of arrays", () => {
    const requires = [
      { item: "title", otherItem: ["numbers", "test"] },
      "newTitle",
    ] as string[];

    const forbidden = ["imForbidden"];

    const propsOk = {
      item: { title: "t", number: 1 },
      otherItem: { numbers: 1, test: 2 },
      newTitle: "ok",
    };
    expect(checkPropsValidity(propsOk, requires, forbidden)).toBe(false);

    const propsMissing = {
      item: { number: 1 },
    };
    expect(checkPropsValidity(propsMissing, requires, forbidden)).toBe(true);
  });
});
