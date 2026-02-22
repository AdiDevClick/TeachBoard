import { LeftSidePageContent } from "@/pages/Evaluations/create/left-content/LeftSidePageContent";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

// simple stub item used in tests
const baseItem = {
  number: 1,
  title: "Test title",
  description: "A description",
};

describe("LeftSidePageContent", () => {
  it("should render description when not clicked and have visible state", () => {
    render(<LeftSidePageContent item={baseItem} isClicked={false} />);
    const desc = screen.getByText("A description");
    expect(desc).toBeInTheDocument();
    expect(desc).toHaveAttribute("data-state", "visible");
  });

  it("should render children when clicked and add expanded data-state", () => {
    const Child = () => <div data-testid="child">child</div>;

    const { rerender, container } = render(
      <LeftSidePageContent item={baseItem} isClicked={false} />,
    );

    const wrapper = container.querySelector(
      ".evaluation-page__left-side-content",
    );
    expect(wrapper).not.toBeNull();
    // collapsed state when not clicked
    expect(wrapper).toHaveAttribute("data-state", "collapsed");

    // toggle to clicked and supply children
    rerender(
      <LeftSidePageContent item={baseItem} isClicked={true}>
        <Child />
      </LeftSidePageContent>,
    );

    expect(screen.getByTestId("child")).toBeInTheDocument();
    // wrapper should now be expanded
    expect(wrapper).toHaveAttribute("data-state", "expanded");
    // description should be hidden when expanded
    const descWhile = screen.getByText("A description");
    expect(descWhile).toHaveAttribute("data-state", "hidden");

    // collapse again
    rerender(<LeftSidePageContent item={baseItem} isClicked={false} />);
    expect(wrapper).toHaveAttribute("data-state", "collapsed");
    // description should be visible after collapse
    const desc = screen.getByText("A description");
    expect(desc).toHaveAttribute("data-state", "visible");
  });
});
