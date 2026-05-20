import { withInlineItemAndSwitchSelection } from "@/components/HOCs/withInlineItemAndSwitchSelection";
import { AppTestWrapper } from "@/tests/components/AppTestWrapper";
import { afterEach, describe, expect, test, vi } from "vitest";
import { userEvent } from "vitest/browser";
import { render } from "vitest-browser-react";

const InlineItemWithSwitch = withInlineItemAndSwitchSelection(() => null);

afterEach(() => {
  vi.restoreAllMocks();
});

describe("withInlineItemAndSwitchSelection", () => {
  test("keeps the switch controllable when no initial selection is provided", async () => {
    const onChange = vi.fn();

    await render(
      <AppTestWrapper>
        <InlineItemWithSwitch title="isAllDay" onChange={onChange} />
      </AppTestWrapper>,
    );

    const switchButton = document.querySelector<HTMLButtonElement>(
      'button[role="switch"]',
    );

    expect(switchButton).not.toBeNull();
    if (!switchButton) {
      throw new Error("Expected the switch button to render");
    }

    await expect.poll(() => switchButton?.getAttribute("aria-checked")).toBe(
      "false",
    );

    await userEvent.click(switchButton);

    await expect.poll(() => switchButton?.getAttribute("aria-checked")).toBe(
      "true",
    );
    expect(onChange).toHaveBeenCalledWith(true);
  });
});