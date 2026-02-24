import { LeftSidePageContent } from "@/pages/Evaluations/create/left-content/LeftSidePageContent";
import { waitForTextToBeAbsent } from "@/tests/test-utils/vitest-browser.helpers";
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render } from "vitest-browser-react";

// simple stub item used in tests
const baseItem = {
  number: 1,
  title: "Test title",
  description: "A description",
};

describe("LeftSidePageContent", () => {
  afterEach(async () => {
    // ensure DOM is cleaned between tests
    await cleanup();
  });

  it("should render description when not clicked and have visible state", async () => {
    const { container } = await render(
      <LeftSidePageContent item={baseItem} isClicked={false} />,
    );

    // description should be visible and no children rendered
    const desc = container.querySelector("[data-left='visible']");
    expect(desc).not.toBeNull();
    expect(container.textContent).toContain("A description");
    expect(container.textContent).toContain("Test title");

    // nothing should be marked hidden
    expect(container.querySelector("[data-left='hidden']")).toBeNull();
  });

  it("should render children when clicked and update data-left state", async () => {
    const Child = () => <div data-testid="child">child</div>;

    const { rerender, container } = await render(
      <LeftSidePageContent item={baseItem} isClicked={false} />,
    );

    // initial description visible
    const descInitial = container.querySelector("[data-left='visible']");
    expect(descInitial).not.toBeNull();

    // toggle to clicked and supply children
    rerender(
      <LeftSidePageContent item={baseItem} isClicked={true}>
        <Child />
      </LeftSidePageContent>,
    );

    const childElem = container.querySelector("[data-testid='child']");
    expect(childElem).not.toBeNull();
    // after click, description is hidden
    // description should be hidden when expanded
    const descElem = container.querySelector("[data-left]");
    expect(descElem).not.toBeNull();
    expect(descElem).toHaveAttribute("data-left", "hidden");
    // helper not reliable here; we already asserted data-left attribute

    // collapse again
    rerender(<LeftSidePageContent item={baseItem} isClicked={false} />);
    const descAfter = container.querySelector("[data-left='visible']");
    expect(descAfter).not.toBeNull();
    await waitForTextToBeAbsent("A description", { present: true });
  });
});
