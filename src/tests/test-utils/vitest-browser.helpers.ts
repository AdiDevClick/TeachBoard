import { wait } from "@/utils/utils.ts";
import { expect } from "vitest";
import { page, userEvent } from "vitest/browser";

const SELECTORS = {
  dialogContent: '[data-slot="dialog-content"]',
  dialogOverlay: '[data-slot="dialog-overlay"]',
  popoverContent: '[data-slot="popover-content"]',
  popoverContentOpen: '[data-slot="popover-content"][data-state="open"]',
  commandRoot:
    '[data-slot="command"], [data-slot="command-list"], [data-slot="command-input"], [cmdk-root], [cmdk-list], [cmdk-input]',
  commandItems: '[data-slot="command-item"], [cmdk-item], [role="option"]',
  commandInput: '[data-slot="command-input"], [cmdk-input]',
  commandEmpty: '[data-slot="command-empty"], [cmdk-empty]',
} as const;

function getLastVisibleDialogContent(): HTMLElement | null {
  const dialogContents = Array.from(
    document.querySelectorAll<HTMLElement>(SELECTORS.dialogContent)
  );

  const lastVisibleDialog = [...dialogContents].reverse().find((el) => {
    if (el.dataset.state === "open") return true;
    try {
      const style = getComputedStyle(el);
      return style.display !== "none" && style.visibility !== "hidden";
    } catch {
      return true;
    }
  });

  return lastVisibleDialog ?? null;
}

function isElementActuallyVisible(
  el: HTMLElement,
  opts?: { checkOpacity?: boolean }
): boolean {
  if (el.hasAttribute("hidden")) return false;

  try {
    const style = getComputedStyle(el);
    if (style.display === "none") return false;
    if (style.visibility === "hidden") return false;
    if (opts?.checkOpacity && style.opacity === "0") return false;
  } catch {
    // If styles can't be computed (rare in tests), assume visible.
  }

  if (opts?.checkOpacity) {
    const rect = el.getBoundingClientRect();
    return rect.width > 0 && rect.height > 0;
  }

  return true;
}

function isPopoverOpen(): boolean {
  return getOpenPopoverContent() !== null;
}

async function waitForPopoverOpen(timeout = 500) {
  await expect.poll(isPopoverOpen, { timeout }).toBe(true);
}

async function waitForPopoverClosed(timeout = 500) {
  await expect.poll(isPopoverOpen, { timeout }).toBe(false);
}

function dispatchDismissClick(el: Element) {
  // Avoid locator-based clicks (actionability/visibility checks can be flaky in the
  // vitest browser iframe). Radix dismiss logic relies on pointer events.
  const win = el.ownerDocument.defaultView ?? globalThis;
  const common = {
    bubbles: true,
    cancelable: true,
    composed: true,
    button: 0,
    buttons: 1,
    clientX: 0,
    clientY: 0,
  };

  const pointerEvents = ["pointerdown", "pointerup"];
  const mouseEvents = ["mousedown", "mouseup", "click"];

  // PointerEvent may not exist in every environment, but in vitest-browser
  // (real Chromium) it does.
  if (typeof win.PointerEvent === "function") {
    const pointerOptions = {
      ...common,
      pointerId: 1,
      isPrimary: true,
      pointerType: "mouse",
    };
    pointerEvents.forEach((eventName) => {
      el.dispatchEvent(new win.PointerEvent(eventName, pointerOptions));
    });
  }

  mouseEvents.forEach((eventName) => {
    el.dispatchEvent(new win.MouseEvent(eventName, common));
  });
}

async function clickTrigger(trigger: Parameters<typeof userEvent.click>[0]) {
  // Prefer direct DOM click when possible to avoid Playwright's strict
  // actionability checks (which can be flaky in the vitest browser iframe).
  if (trigger instanceof HTMLElement) {
    trigger.click();
  } else {
    await userEvent.click(trigger);
  }
}

async function closeOpenPopoverIfAny() {
  if (!isPopoverOpen()) return;

  // Clicking the trigger can be flaky because the popover content may cover it
  // and intercept pointer events. Escape + outside pointerdown is more reliable.
  await userEvent.keyboard("{Escape}");

  try {
    await waitForPopoverClosed();
    return;
  } catch {
    const overlay = document.querySelector<HTMLElement>(
      SELECTORS.dialogOverlay
    );
    const dismissTarget =
      (getLastVisibleDialogContent() ? overlay : null) ?? document.body;
    dispatchDismissClick(dismissTarget);
    await waitForPopoverClosed();
  }
}

async function openPopoverWithRetries(
  trigger: Parameters<typeof userEvent.click>[0]
) {
  // In some fast UI flows (especially inside dialogs), Radix popovers can
  // briefly open and then immediately dismiss due to late focus/state updates.
  // Retry opening a few times and ensure it stays open for at least a tick.
  for (let attempt = 0; attempt < 3; attempt++) {
    await clickTrigger(trigger);
    await waitForPopoverOpen();

    // Let pending focus/state updates flush.
    await wait(25);

    if (isPopoverOpen()) return;
  }

  // One last attempt: wait a bit longer after opening.
  await clickTrigger(trigger);
  await waitForPopoverOpen();
}

async function detectCmdkInOpenPopover(timeout = 250): Promise<boolean> {
  const initial = getOpenPopoverContent();

  try {
    await expect
      .poll(
        () => {
          const open = getOpenPopoverContent();
          if (!open) return false;
          return hasCmdk(open);
        },
        { timeout }
      )
      .toBe(true);
    return true;
  } catch {
    return hasCmdk(getOpenPopoverContent() ?? initial);
  }
}

async function waitForPopoverToCloseOrChange(
  previous: HTMLElement,
  timeout = 400
) {
  await expect
    .poll(
      () => {
        const now = getOpenPopoverContent();
        return now === null || now !== previous;
      },
      { timeout }
    )
    .toBe(true);
}

function hasCmdk(container: HTMLElement | null): boolean {
  return container?.querySelector(SELECTORS.commandRoot) !== null;
}

function resetCmdkInput(container: HTMLElement): void {
  const cmdkInput = getCommandItem(container);
  if (cmdkInput && cmdkInput.value) {
    try {
      cmdkInput.value = "";
      cmdkInput.dispatchEvent(new Event("input", { bubbles: true }));
    } catch {
      // non-fatal
    }
  }
}

async function waitForCmdkReady(timeout = 1500) {
  await expect
    .poll(
      () => {
        const open = getOpenPopoverContent();
        if (!open) return false;

        resetCmdkInput(open);

        const items = getCommandItemsInContainer(open);
        if (items.length > 0) return true;

        const empty = open.querySelector<HTMLElement>(SELECTORS.commandEmpty);
        return empty
          ? isElementActuallyVisible(empty, { checkOpacity: true })
          : false;
      },
      { timeout }
    )
    .toBe(true);
}

type FetchMock = typeof fetch & {
  mock?: {
    calls: unknown[][];
  };
};

function getCallUrl(call: unknown[]): string {
  const urlArg = call[0];

  if (typeof urlArg === "string") return urlArg;
  if (urlArg instanceof URL) return urlArg.toString();

  if (typeof urlArg === "object" && urlArg !== null && "url" in urlArg) {
    const withUrl = urlArg as { url?: unknown };
    if (typeof withUrl.url === "string") return withUrl.url;
  }

  return "";
}

function getCallMethod(call: unknown[]): string {
  const init = call[1];
  if (typeof init !== "object" || init === null) return "GET";
  if (!("method" in init)) return "GET";

  const withMethod = init as { method?: unknown };
  return typeof withMethod.method === "string" ? withMethod.method : "GET";
}

export function getFetchMock(): FetchMock {
  return globalThis.fetch as FetchMock;
}

export function countFetchCalls(method?: string): number {
  const fetchMock = getFetchMock();
  const calls = fetchMock.mock?.calls ?? [];

  if (!method) return calls.length;

  const upper = method.toUpperCase();
  return calls.filter((c) => getCallMethod(c).toUpperCase() === upper).length;
}

export function countFetchCallsByUrl(url: string | RegExp, method?: string) {
  const fetchMock = getFetchMock();
  const calls = fetchMock.mock?.calls ?? [];

  const methodUpper = method ? method.toUpperCase() : undefined;

  return calls.filter((c) => {
    const calledUrl = getCallUrl(c);
    const calledMethod = getCallMethod(c).toUpperCase();

    const urlMatches =
      typeof url === "string" ? calledUrl.includes(url) : url.test(calledUrl);
    const methodMatches = methodUpper ? calledMethod === methodUpper : true;

    return urlMatches && methodMatches;
  }).length;
}

export async function openPopoverByTriggerName(name: RegExp) {
  await openPopover(page.getByRole("button", { name }));
}

function isVisibleElement(el: HTMLElement): boolean {
  return isElementActuallyVisible(el, { checkOpacity: true });
}

function isNotHiddenElement(el: HTMLElement): boolean {
  return isElementActuallyVisible(el, { checkOpacity: false });
}

function getCommandItemLabel(el: HTMLElement): string {
  const text = (el.textContent ?? "").trim();
  if (text) return text;

  // cmdk stores the resolved item value on the element.
  const dataValue = el.dataset.value;
  if (dataValue?.trim()) return dataValue.trim();

  const valueAttr = el.getAttribute("value");
  return (valueAttr ?? "").trim();
}

function findLabelElementScoped(
  label: RegExp,
  withinDialog?: boolean
): HTMLLabelElement | undefined {
  if (withinDialog) {
    const scope = getLastVisibleDialogContent() ?? document.body;
    const labelElements = Array.from(scope.querySelectorAll("label"));
    return labelElements.find((el) =>
      label.test((el.textContent ?? "").trim())
    );
  }

  const labelElements = Array.from(document.querySelectorAll("label"));
  return labelElements.find((el) => label.test((el.textContent ?? "").trim()));
}

function getTriggerFromLabelElement(
  labelElement: HTMLLabelElement,
  label: RegExp
): HTMLElement {
  const htmlFor = labelElement.getAttribute("for");

  if (htmlFor) {
    const control = document.getElementById(htmlFor);
    if (control instanceof HTMLElement) {
      return control;
    } else {
      throw new TypeError(
        `Popover control not found for label: ${String(label)}`
      );
    }
  }

  const container = labelElement.parentElement;
  if (!container)
    throw new TypeError(`Popover container not found for label: ${label}`);

  const trigger =
    container.querySelector<HTMLElement>(
      'button[data-slot="popover-trigger"]'
    ) ?? container.querySelector<HTMLElement>("button");

  if (!trigger)
    throw new TypeError(`Popover trigger button not found for label: ${label}`);

  return trigger;
}

export async function selectCommandItemInContainer(
  container: HTMLElement,
  pattern: RegExp,
  timeout = 500
) {
  // In single-select popovers, selecting an item closes the popover.
  // That close can be asynchronous (state updates/animations). If we
  // immediately open the next popover, the late "close" can accidentally
  // close the newly opened one. Track the current open popover and
  // (best-effort) wait for it to close/change after selection.
  const popoverBeforeSelection = getOpenPopoverContent();

  await expect
    .poll(
      () => {
        const items = getCommandItemsInContainer(container);
        return items.some((el) => pattern.test(getCommandItemLabel(el)));
      },
      { timeout }
    )
    .toBe(true);

  const items = getCommandItemsInContainer(container);
  const target = items.find((el) => pattern.test(getCommandItemLabel(el)));
  if (!target)
    throw new Error(
      `[ui test] Command item not found for pattern: ${String(pattern)}`
    );

  const input = getCommandItem(container);

  if (input) {
    // Clear any persisted filter text to avoid empty lists on subsequent opens.
    try {
      input.focus();
    } catch {
      // Fallback to userEvent if focus throws for any reason.
      await userEvent.click(input);
    }
    await userEvent.clear(input);
  }

  if (target instanceof HTMLElement) {
    target.click();
  } else {
    await userEvent.click(target);
  }

  if (!popoverBeforeSelection) return;

  try {
    await waitForPopoverToCloseOrChange(popoverBeforeSelection, 400);
  } catch {
    // Multi-select popovers stay open; don't fail the test for that.
  }
}

function getCommandItemsInContainer(container: ParentNode): HTMLElement[] {
  // Most of the app uses shadcn/ui's CommandItem wrapper (data-slot="command-item"),
  // but cmdk also renders raw items with the [cmdk-item] attribute.
  // In some environments, the most stable hook is the ARIA role.
  return Array.from(
    container.querySelectorAll<HTMLElement>(SELECTORS.commandItems)
  ).filter((el) => isNotHiddenElement(el));
}

function getCommandItem(container: ParentNode): HTMLInputElement | null {
  // Most of the app uses shadcn/ui's CommandItem wrapper (data-slot="command-item"),
  // but cmdk also renders raw items with the [cmdk-item] attribute.
  if (!container) return null;

  return container.querySelector<HTMLInputElement>(SELECTORS.commandInput);
}

async function selectItemsByPatterns(
  label: RegExp,
  patterns: RegExp[],
  opts?: { withinDialog?: boolean; timeout?: number }
) {
  const findNewPopover = () => getOpenPopoverContent() ?? document.body;

  let popover = findNewPopover();

  for (const [i, pattern] of patterns.entries()) {
    await selectCommandItemInContainer(popover, pattern, opts?.timeout ?? 500);

    const stillOpen = getOpenPopoverContent() === popover;
    if (!stillOpen && i !== patterns.length - 1) {
      // Re-open the popover by label (since it closed on selection)
      await openPopoverByLabelText(label, {
        withinDialog: opts?.withinDialog,
        timeout: opts?.timeout,
      });
      popover = findNewPopover();
    }
  }
}

export async function openPopoverByLabelText(
  label: RegExp,
  opts?: { withinDialog?: boolean; items?: RegExp | RegExp[]; timeout?: number }
) {
  // Opens a popover by finding a label and clicking its associated control/trigger.
  // If `opts.withinDialog` is true, search will be scoped to the currently open dialog.
  // If `opts.items` is provided, the helper will select those item(s) inside the
  // opened popover (supports single RegExp or array for multi-select).

  // Use DOM walking in all cases.
  // This is more reliable than locator-based clicks in the vitest browser iframe
  // (especially when dialogs/popovers overlap).
  const labelElement = findLabelElementScoped(label, opts?.withinDialog);
  if (!labelElement) throw new TypeError(`Popover label not found: ${label}`);
  const trigger = getTriggerFromLabelElement(labelElement, label);
  await openPopover(trigger);

  // If no items to select, we're done.
  if (!opts?.items) return;

  const patterns: RegExp[] = Array.isArray(opts.items)
    ? opts.items
    : [opts.items];
  await selectItemsByPatterns(label, patterns, {
    withinDialog: opts?.withinDialog,
    timeout: opts?.timeout,
  });
}

export async function openPopoverByContainerId(containerId: string) {
  const container = document.getElementById(containerId);
  if (!container) {
    throw new TypeError(`Popover container not found: ${containerId}`);
  }

  const trigger = container.querySelector("button");
  if (!(trigger instanceof HTMLElement)) {
    throw new TypeError(`Popover trigger button not found in: ${containerId}`);
  }

  await openPopover(trigger);
}

async function openPopover(trigger: Parameters<typeof userEvent.click>[0]) {
  // If it's already open (e.g. dialog opened on top), close first so we can
  // re-open and force a re-render with updated cached data.
  await closeOpenPopoverIfAny();

  await openPopoverWithRetries(trigger);

  // In tests, cmdk's input value can persist across open/close cycles and
  // filter out all items in the next popover. Also, cmdk content may mount a
  // moment *after* the popover opens. Detect cmdk and wait for it to be ready.
  const hasCmdkInPopover = await detectCmdkInOpenPopover(250);
  if (hasCmdkInPopover) {
    // Best-effort: move focus inside the popover ASAP. In some fast UI flows
    // (especially inside dialogs), a late focus shift can dismiss Radix popovers.
    try {
      const open = getOpenPopoverContent();
      const cmdkInput = open ? getCommandItem(open) : null;
      cmdkInput?.focus();
    } catch {
      // non-fatal
    }

    await waitForCmdkReady(1500);
  }
}

export function getOpenPopoverContent(): HTMLElement | null {
  // Radix popovers are portaled; during fast open/close cycles, multiple
  // contents can exist in the DOM. Prefer the most recently *open* one.
  const open = Array.from(
    document.querySelectorAll<HTMLElement>(SELECTORS.popoverContentOpen)
  );
  if (open.length > 0) return open[open.length - 1];

  // Fallback: if data-state isn't present for some reason, prefer the most
  // recently visible one.
  const contents = Array.from(
    document.querySelectorAll<HTMLElement>(SELECTORS.popoverContent)
  );
  const visible = contents.filter((el) => isVisibleElement(el));
  return visible.length > 0 ? visible[visible.length - 1] : null;
}

export function getOpenPopoverCommandItemTexts(): string[] {
  const popover = getOpenPopoverContent();
  if (!popover) return [];

  return getCommandItemsInContainer(popover)
    .map((el) => getCommandItemLabel(el))
    .filter(Boolean);
}

export function getOpenPopoverCommandDebugText(): string {
  const popover = getOpenPopoverContent();
  if (!popover) {
    const all = Array.from(
      document.querySelectorAll<HTMLElement>(SELECTORS.popoverContent)
    );
    const last = all.length > 0 ? all[all.length - 1] : null;
    let styleSummary = "";
    if (last) {
      try {
        const style = getComputedStyle(last);
        styleSummary = `display=${style.display} visibility=${style.visibility} opacity=${style.opacity}`;
      } catch {
        styleSummary = "style=?";
      }
    }
    return `__NO_OPEN_POPOVER__ total=${all.length} lastState=${
      last?.dataset.state ?? ""
    } ${styleSummary}`;
  }

  const itemTexts = getOpenPopoverCommandItemTexts();
  if (itemTexts.length > 0) return itemTexts.join(" ");

  const counts = {
    command: popover.querySelectorAll('[data-slot="command"], [cmdk-root]')
      .length,
    list: popover.querySelectorAll('[data-slot="command-list"], [cmdk-list]')
      .length,
    input: popover.querySelectorAll('[data-slot="command-input"], [cmdk-input]')
      .length,
    empty: popover.querySelectorAll('[data-slot="command-empty"], [cmdk-empty]')
      .length,
    slotItems: popover.querySelectorAll('[data-slot="command-item"]').length,
    cmdkItems: popover.querySelectorAll("[cmdk-item]").length,
    roleOptions: popover.querySelectorAll('[role="option"]').length,
    dataValue: popover.querySelectorAll("[data-value]").length,
  };

  const input = popover.querySelector<HTMLInputElement>(
    '[data-slot="command-input"], [cmdk-input]'
  );
  const emptyEl = popover.querySelector<HTMLElement>(
    '[data-slot="command-empty"], [cmdk-empty]'
  );

  const emptyText = (emptyEl?.textContent ?? "").trim().slice(0, 80);
  const inputValue = (input?.value ?? "").trim().slice(0, 80);

  return `__EMPTY__ counts=${JSON.stringify(
    counts
  )} input="${inputValue}" emptyText="${emptyText}"`;
}

export function getOpenCommandContainer(): HTMLElement {
  const openPopover = getOpenPopoverContent();
  if (openPopover) return openPopover;

  return getLastVisibleDialogContent() ?? document.body;
}
