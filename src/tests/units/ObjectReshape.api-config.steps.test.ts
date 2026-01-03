import { describe, expect, it } from "vitest";
import { ObjectReshape } from "@/utils/ObjectReshape";

describe("ObjectReshape - API config step contracts", () => {
  it("assignSourceTo('items') exposes the original array under root.items", () => {
    const payload = [
      { id: "1", firstName: "Alice", lastName: "Doe", img: "a.png" },
    ];

    const shaped = new ObjectReshape(payload as any).assignSourceTo("items").newShape();

    expect(Array.isArray(shaped)).toBe(true);
    expect(Array.isArray(shaped[0].items)).toBe(true);
    expect(shaped[0].items[0].id).toBe("1");
    expect(shaped[0].items[0].firstName).toBe("Alice");
  });

  it("addToRoot({groupTitle}) adds root-level fields", () => {
    const shaped = new ObjectReshape([] as any)
      .addToRoot({ groupTitle: "Tous" })
      .newShape();

    expect(shaped[0].groupTitle).toBe("Tous");
  });

  it("createPropertyWithContentFromKeys computes a joined value (via buildItem)", () => {
    const reshaper = new ObjectReshape([] as any).createPropertyWithContentFromKeys(
      ["firstName", "lastName"],
      "fullName",
      " "
    );

    const item = reshaper.buildItem({ firstName: "Alice", lastName: "Doe" });
    expect(item.fullName).toBe("Alice Doe");
  });

  it("setProxyPropertyWithContent creates a fixed computed value (via buildItem)", () => {
    const reshaper = new ObjectReshape([] as any).setProxyPropertyWithContent(
      "newRole",
      "Enseignant"
    );

    const item = reshaper.buildItem({});
    expect(item.newRole).toBe("Enseignant");
  });

  it("assign maps one source key to multiple output keys (via buildItem)", () => {
    const reshaper = new ObjectReshape([] as any).assign([
      ["fullName", "value", "name"],
    ]);

    const item = reshaper.buildItem({ fullName: "Alice Doe" });
    expect(item.value).toBe("Alice Doe");
    expect(item.name).toBe("Alice Doe");
  });

  it("assign can map computed source keys to output keys (proxy usage like API config)", () => {
    const payload = [
      { id: "1", firstName: "Bob", lastName: "Smith", img: "b.png" },
    ];

    const shaped = new ObjectReshape(payload as any)
      .assignSourceTo("items")
      .addToRoot({ groupTitle: "Tous" })
      .createPropertyWithContentFromKeys(
        ["firstName", "lastName"],
        "fullName",
        " "
      )
      .setProxyPropertyWithContent("newRole", "Enseignant")
      .assign([
        ["fullName", "value"],
        ["fullName", "name"],
        ["newRole", "email"],
        ["img", "avatar"],
      ])
      .newShape();

    expect(shaped[0].groupTitle).toBe("Tous");
    expect(shaped[0].items[0].value).toBe("Bob Smith");
    expect(shaped[0].items[0].name).toBe("Bob Smith");
    expect(shaped[0].items[0].avatar).toBe("b.png");
    expect(shaped[0].items[0].email).toBe("Enseignant");
  });

  it("rename(oldKey,newKey) renames a top-level response key (like Skills->items)", () => {
    const payload = {
      Skills: [{ id: "s1", code: "JS", name: "JavaScript" }],
    };

    const shaped = new ObjectReshape(payload as any)
      .rename("Skills", "items")
      .addToRoot({ groupTitle: "Tous" })
      .assign([["code", "value"]])
      .newShape();

    expect(shaped[0].groupTitle).toBe("Tous");
    expect(shaped[0].items[0].value).toBe("JS");
  });

  it("selectElementsTo(['task','id'],'items') flattens nested objects with overwrite priority", () => {
    const payload = [
      {
        id: "root-id",
        task: { id: "task-id", name: "Exercice 1", description: "Addition" },
      },
    ];

    const shaped = new ObjectReshape(payload as any)
      .selectElementsTo(["task", "id"], "items")
      .addToRoot({ groupTitle: "Tous" })
      .assign([["name", "value"]])
      .newShape();

    expect(shaped[0].groupTitle).toBe("Tous");
    expect(shaped[0].items[0].id).toBe("root-id");
    expect(shaped[0].items[0].value).toBe("Exercice 1");
  });

  it("addTo() inserts into an existing group or creates a new group", () => {
    const cached = [
      {
        groupTitle: "Tous",
        items: [{ id: "old", value: "old" }],
      },
    ];

    const shapedExisting = new ObjectReshape(cached as any)
      .addTo({ id: "new", value: "new" }, "items", "groupTitle", "Tous")
      .newShape();

    expect(shapedExisting[0].groupTitle).toBe("Tous");
    expect(shapedExisting[0].items.map((i: any) => i.value)).toContain("new");

    const shapedNewGroup = new ObjectReshape(cached as any)
      .addTo({ id: "x", value: "x" }, "items", "groupTitle", "BTS")
      .newShape();

    expect(shapedNewGroup.map((g: any) => g.groupTitle)).toContain("BTS");
  });

  it("build() materializes computed + mapped keys for caching (no proxies required)", () => {
    const payload = [{ firstName: "Alice", lastName: "Doe" }];

    const built = new ObjectReshape(payload as any)
      .assignSourceTo("items")
      .addToRoot({ groupTitle: "Tous" })
      .createPropertyWithContentFromKeys(
        ["firstName", "lastName"],
        "fullName",
        " "
      )
      .assign([["fullName", "value", "name"]])
      .build();

    expect(built[0].groupTitle).toBe("Tous");
    expect(built[0].items[0]).toEqual(
      expect.objectContaining({ value: "Alice Doe", name: "Alice Doe" })
    );
  });
});
