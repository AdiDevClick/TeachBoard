import {
  classFetched,
  classFetched2,
} from "@/tests/samples/class-creation-sample-datas.ts";
import type { InputControllerLike } from "@/tests/test-utils/class-creation/regex.functions.ts";
import {
  controllerLabelRegex,
  controllerTriggerRegex,
} from "@/tests/test-utils/class-creation/regex.functions.ts";
import {
  clickControlByLabelText,
  escapeRegExp,
  getOpenDialogContent,
  getOpenPopoverContent,
  openPopoverAndExpectByLabel,
  openPopoverAndExpectByTrigger,
  waitForDialogAndAssertText,
  waitForPopoverState,
} from "@/tests/test-utils/vitest-browser.helpers.ts";
import { expect } from "vitest";
import { page, userEvent } from "vitest/browser";

/**
 * This file containes useful UI functions shared across multiple test files.
 *
 * @remarks This is a pure test related generic UI functions file.
 */

/**
 * Closes the currently open (top-most) dialog by clicking its "Annuler" button.
 *
 * Use this instead of pressing Escape: Radix dialogs close on Escape and tests
 * may have nested dialogs/popovers.
 */
export async function closeTopDialogByCancel() {
  const dialogEl = getOpenDialogContent();
  const dialog = page.elementLocator(dialogEl);
  await userEvent.click(dialog.getByRole("button", { name: /^Annuler$/i }));
}

/**
 * Clicks an enabled button with the given name.
 *
 * @param name - The name of the button to click.
 */
export async function clickEnabledButton(name: string | RegExp) {
  const button = page.getByRole("button", { name: name });
  await expect.element(button).toBeEnabled();
  await userEvent.click(button);
}

/**
 * Opens the creation modal from popover, and asserts it's opened and ready.
 *
 * @description This will check in order :
 * - If the popover is already open (if not, it opens it).
 * - Clicks the creation button inside the popover.
 * - Waits for the modal to be opened and be ready.
 * - Verify the ready text is present in the modal.
 *
 * @param name - Name or regex of the creation button to click.
 * @param opts - Options.
 */
export async function openModalAndAssertItsOpenedAndReady<
  T extends InputControllerLike
>(
  name: RegExp | string,
  opts?: {
    listAlreadyOpen?: boolean;
    controller?: T;
    nameArray?: (string | RegExp)[];
    readyText?: string | RegExp;
  }
) {
  // The creation button lives inside the popover.
  if (!opts?.listAlreadyOpen) {
    try {
      await openPopoverAndExpectByLabel(
        controllerLabelRegex(opts?.controller as T),
        opts?.nameArray ?? [classFetched.name, classFetched2.name]
      );
    } catch {
      // Fall back to opening by trigger if there's no visible label for this controller
      await openPopoverAndExpectByTrigger(
        controllerTriggerRegex(opts?.controller as T),
        opts?.nameArray ?? [classFetched.name, classFetched2.name]
      );
    }
  }

  // Click the creation button (ensure it's enabled first).
  await clickEnabledButton(name);

  // Ensure modal is opened and ready (it should display the ready text).
  await waitForDialogAndAssertText(opts?.readyText ?? name, {
    present: true,
    withinDialog: true,
  });
}

/**
 * Asserts whether a lucide icon is present or absent for a given option inside a container.
 */
export async function assertLucideIconForOptionInContainer(
  containerEl: HTMLElement,
  optionName: RegExp,
  opts: {
    icon: string;
    present: boolean;
  }
) {
  const container = page.elementLocator(containerEl);
  const option = container.getByRole("option", { name: optionName });
  const icon = option.getByCss(`svg.lucide-${opts.icon}`);

  if (opts.present) {
    await expect.element(icon).toBeInTheDocument();
  } else {
    await expect.element(icon).not.toBeInTheDocument();
  }
}

/**
 * Asserts the presence or absence of the lucide "check" icon
 *
 * @param textToCheck - Text or regex to look for
 * @param present - Whether the icon should be present or absent
 * @param icon - Icon to look for (default: "check")
 */
export async function assertLucideCheckIconInOpenPopover(
  textToCheck: string | RegExp,
  present: boolean,
  icon: string = "check"
) {
  const containerEl = getOpenPopoverContent() ?? getOpenDialogContent();

  expect(containerEl).not.toBeNull();

  // If textToCheck is already a RegExp, use it directly; otherwise create one with codeRx
  const nameRegex =
    textToCheck instanceof RegExp ? textToCheck : codeRx(textToCheck);

  await assertLucideIconForOptionInContainer(containerEl, nameRegex, {
    icon,
    present,
  });
}

/**
 * Creates a regex to match an exact code inside popover items.
 *
 * @param code - Code to match
 * @returns
 */
export function codeRx(code: string) {
  // Popover items sometimes render as concatenated text like "DécouperSUB_01".
  // Word boundaries (\b) won't match between two word-chars, so instead:
  // - allow being preceded/followed by non-[A-Z0-9_] chars (or string edges)
  // - prevents false-positives like SUB_01 matching inside NET_SUB_01
  return new RegExp(
    String.raw`(?<![A-Z0-9_])${escapeRegExp(code)}(?![A-Z0-9_])`,
    ""
  );
}

/**
 * Clicks a control (by label) and waits for a dialog containing the given
 * text/regex to be present. Useful for controls that open nested dialogs.
 */
export async function clickControlAndWaitForDialog(
  label: RegExp,
  dialogText: string | RegExp,
  opts?: { withinDialog?: boolean; timeout?: number }
) {
  await clickControlByLabelText(label, { withinDialog: opts?.withinDialog });
  await waitForDialogAndAssertText(dialogText, {
    present: true,
    withinDialog: true,
    timeout: opts?.timeout,
  });
}

/**
 * Clicks a popover trigger button and waits for the popover to reach the
 * expected open state. Useful to reliably close multi-select popovers by
 * clicking their trigger (instead of using Escape which can close dialogs).
 */
export async function clickTriggerAndWaitForPopoverState(
  trigger: RegExp,
  expectedOpen = false,
  timeout = 500
) {
  await clickEnabledButton(trigger);
  await waitForPopoverState(expectedOpen, timeout);
}
