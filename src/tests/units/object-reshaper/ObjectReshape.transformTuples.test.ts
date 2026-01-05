import { describe, expect, it } from "vitest";
import { ObjectReshape } from "../../../utils/ObjectReshape";

describe("ObjectReshape - transformTuplesToGroups", () => {
  it("should transform dynamic object keys into array of groups", () => {
    const input = {
      "Bac Pro": [
        { id: 1, name: "Bac Pro Commerce", code: "BPCOM" },
        { id: 2, name: "Bac Pro Vente", code: "BPVEN" },
      ],
      BTS: [
        { id: 3, name: "BTS MUC", code: "BTSMUC" },
        { id: 4, name: "BTS NRC", code: "BTSNRC" },
      ],
      Licence: [{ id: 5, name: "Licence Pro", code: "LP" }],
    };

    const result = new ObjectReshape(input)
      .transformTuplesToGroups("groupTitle", "items")
      .newShape();

    expect(result).toEqual([
      {
        groupTitle: "Bac Pro",
        items: [
          { id: 1, name: "Bac Pro Commerce", code: "BPCOM" },
          { id: 2, name: "Bac Pro Vente", code: "BPVEN" },
        ],
      },
      {
        groupTitle: "BTS",
        items: [
          { id: 3, name: "BTS MUC", code: "BTSMUC" },
          { id: 4, name: "BTS NRC", code: "BTSNRC" },
        ],
      },
      {
        groupTitle: "Licence",
        items: [{ id: 5, name: "Licence Pro", code: "LP" }],
      },
    ]);
  });

  it("should transform tuples and apply mappings to items", () => {
    const input = {
      "Bac Pro": [
        { id: 1, name: "Bac Pro Commerce", code: "BPCOM" },
        { id: 2, name: "Bac Pro Vente", code: "BPVEN" },
      ],
      BTS: [
        { id: 3, name: "BTS MUC", code: "BTSMUC" },
        { id: 4, name: "BTS NRC", code: "BTSNRC" },
      ],
    };

    const result = new ObjectReshape(input)
      .transformTuplesToGroups("groupTitle", "items")
      .assign([["name", "value"]])
      .newShape();

    expect(result[0].groupTitle).toBe("Bac Pro");
    expect(result[0].items[0].value).toBe("Bac Pro Commerce");
    expect(result[0].items[1].value).toBe("Bac Pro Vente");
    expect(result[1].groupTitle).toBe("BTS");
    expect(result[1].items[0].value).toBe("BTS MUC");
    expect(result[1].items[1].value).toBe("BTS NRC");
  });

  it("should handle empty object", () => {
    const input = {};

    const result = new ObjectReshape(input)
      .transformTuplesToGroups("groupTitle", "items")
      .newShape();

    expect(result).toEqual([]);
  });

  it("allows consuming computed properties through mapped outputs", () => {
    const input = {
      BTS: [{ degreeLevel: "BTS", degreeYear: "2024" }],
    };

    const result = new ObjectReshape(input)
      .transformTuplesToGroups("groupTitle", "items")
      .createPropertyWithContentFromKeys(
        ["degreeLevel", "degreeYear"],
        "description",
        " "
      )
      .assign([["description", "value"]])
      .newShape();

    expect(result[0].items[0].value).toBe("BTS 2024");
  });
});
