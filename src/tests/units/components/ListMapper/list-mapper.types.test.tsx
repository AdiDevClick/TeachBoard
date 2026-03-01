import { ListMapper } from "@/components/Lists/ListMapper";
import { SubMenuButton } from "@/components/Sidebar/nav/elements/sub_menu_button/SubMenuButton";
import { calendarEvents } from "@/data/CalendarData";
import { formatRangeCompat } from "@/utils/utils";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { render } from "vitest-browser-react";

/**
 * This test suite verifies the TypeScript typings of the `ListMapper`.
 * It ensures that:
 * 1. The `ListMapper` component requires the `items` prop and correctly rejects missing or incorrectly typed props.
 * 3. The function passed as children to `ListMapper` receives correctly typed parameters corresponding to the items being mapped.
 * 4. The `ListMapper` component accepts a `children` prop and renders it correctly.
 *
 * Note: These tests are sollely focused on TypeScript type checking and do not perform any runtime assertions on the component's behavior or rendering.
 */

beforeEach(() => {
  vi.spyOn(console, "error").mockImplementation(() => {});
});

describe("withListMapper types", () => {
  it("Case 0: ListMapper will reject if no items props is passed", async () => {
    const { container } = await render(
      // @ts-expect-error missing required `items` prop should be rejected by the component type
      <ListMapper>
        <SubMenuButton ischild />
      </ListMapper>,
    );
    expect(container.children).toBeDefined();
  });

  it("Case 1: ListMapper should render correctly", async () => {
    const { container } = await render(
      <ListMapper
        items={[
          { url: "1", title: "Item 1" },
          { url: "2", title: "Item 2" },
        ]}
      >
        <SubMenuButton ischild />
      </ListMapper>,
    );
    expect(container.children).toBeDefined();
  });

  it("Case 2 : ListMapper function's paramaters should remain typed and render as expected", async () => {
    const { container } = await render(
      <ListMapper items={calendarEvents}>
        {(event) => {
          expect(event).toBeDefined();
          expect(event.title).toBeDefined();
          return (
            <div
              key={event.title}
              className="bg-muted after:bg-primary/70 relative rounded-md p-2 pl-6 text-sm after:absolute after:inset-y-2 after:left-2 after:w-1 after:rounded-full"
            >
              <div className="font-medium">{event.title}</div>
              <div className="text-muted-foreground text-xs">
                {formatRangeCompat(new Date(event.from), new Date(event.to))}
              </div>
            </div>
          );
        }}
      </ListMapper>,
    );

    expect(container).toBeDefined();
  });

  it("Case 3 : ListMapper should accept children prop", async () => {
    const props = {
      items: [
        { url: "1", title: "Item 1" },
        { url: "2", title: "Item 2" },
      ],
      children: <SubMenuButton ischild />,
    };

    const { container } = await render(
      <ListMapper {...props}>{props.children}</ListMapper>,
    );
    expect(container).toBeDefined();
  });

  it("Case 4 : ListMapper optional prop will be correctly be typed and merged", async () => {
    const { container } = await render(
      <ListMapper
        items={[
          { url: "1", title: "Item 1" },
          { url: "2", title: "Item 2" },
        ]}
        optional={{ value: "test" }}
      >
        {(item, index, optional) => {
          expect(item).toBeDefined();
          expect(index).toBeDefined();
          expect(optional).toBeDefined();
          expect(optional.value).toBe("test");

          return (
            <div key={item.url}>
              {item.title} - {optional.value}
            </div>
          );
        }}
      </ListMapper>,
    );
    expect(container).toBeDefined();
  });

  it("Case 5 : ListMapper optional function prop will be correctly be typed and merged", async () => {
    const { container } = await render(
      <ListMapper
        items={[
          { url: "1", title: "Item 1" },
          { url: "2", title: "Item 2" },
        ]}
        optional={(item) => {
          if (item.url === "1") {
            return { value: "test1" };
          }
          return { value: "test2" };
        }}
      >
        {(item, index, optional) => {
          expect(item).toBeDefined();
          expect(index).toBeDefined();
          expect(optional).toBeDefined();
          expect(optional.value).toBe(item.url === "1" ? "test1" : "test2");
          return (
            <div key={item.url}>
              {item.title} - {optional.value}
            </div>
          );
        }}
      </ListMapper>,
    );
    expect(container).toBeDefined();
    expect(container.children).toBeDefined();
  });
});
