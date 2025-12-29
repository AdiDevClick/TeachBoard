import { describe, expect, it } from "vitest";
import { ObjectReshape } from "../../utils/ObjectReshape";

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
      .build();

    expect(result).toEqual([
      {
        groupTitle: "Bac Pro",
        items: [
          {
            id: 1,
            name: "Bac Pro Commerce",
            code: "BPCOM",
            value: "Bac Pro Commerce",
          },
          {
            id: 2,
            name: "Bac Pro Vente",
            code: "BPVEN",
            value: "Bac Pro Vente",
          },
        ],
      },
      {
        groupTitle: "BTS",
        items: [
          { id: 3, name: "BTS MUC", code: "BTSMUC", value: "BTS MUC" },
          { id: 4, name: "BTS NRC", code: "BTSNRC", value: "BTS NRC" },
        ],
      },
    ]);
  });

  it("should handle empty object", () => {
    const input = {};

    const result = new ObjectReshape(input)
      .transformTuplesToGroups("groupTitle", "items")
      .newShape();

    expect(result).toEqual([]);
  });
});
