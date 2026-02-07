import { expect, vi } from "vitest";
import { locators, page, userEvent, type Locator } from "vitest/browser";

declare module "vitest/browser" {
  interface LocatorSelectors {
    getByCss(css: string): Locator;
  }
}

locators.extend({
  getByCss(css: string) {
    return `css=${css}`;
  },
});

const SELECTORS = {
  dialogContent: '[data-slot="dialog-content"]',
  dialogOverlay: '[data-slot="dialog-overlay"]',
  popoverContent: '[data-slot="popover-content"]',
  popoverContentOpen: '[data-slot="popover-content"][data-state="open"]',
  // Command-related selectors
  commandRoot:
    '[data-slot="command"], [data-slot="command-list"], [data-slot="command-input"], [cmdk-root], [cmdk-list], [cmdk-input]',
  commandList: '[data-slot="command-list"], [cmdk-list]',
  commandItems: '[data-slot="command-item"], [cmdk-item], [role="option"]',
  commandSlotItem: '[data-slot="command-item"]',
  cmdkItem: "[cmdk-item]",
  roleOption: '[role="option"]',
  dataValue: "[data-value]",
  commandInput: '[data-slot="command-input"], [cmdk-input]',
  commandEmpty: '[data-slot="command-empty"], [cmdk-empty]',
} as const;

/**
 * Generic element query utilities to reduce repetitive locator boilerplate.
 */
export function elQuery(
  container: Element | null | undefined,
  css: string,
): HTMLElement | null {
  const loc = container ? page.elementLocator(container) : page;
  const el = loc.getByCss(css).query();
  return el instanceof HTMLElement ? el : null;
}

export function elQueryAll(
  container: Element | null | undefined,
  css: string,
): HTMLElement[] {
  const nodes = container
    ? page.elementLocator(container).getByCss(css).elements()
    : page.getByCss(css).elements();
  return (nodes as HTMLElement[]).filter(Boolean);
}

type UiLastAction = {
  at: number;
  action: string;
  details?: Record<string, unknown>;
};

type GlobalWithUiLastAction = typeof globalThis & {
  __TB_UI_LAST_ACTION__?: UiLastAction;
};

function setLastUiAction(action: string, details?: Record<string, unknown>) {
  (globalThis as GlobalWithUiLastAction).__TB_UI_LAST_ACTION__ = {
    at: Date.now(),
    action,
    details,
  } satisfies UiLastAction;
}

function getLastUiAction(): UiLastAction | null {
  return (globalThis as GlobalWithUiLastAction).__TB_UI_LAST_ACTION__ ?? null;
}

async function expectFormToHaveNoErrors(timeout = 1000) {
  await expect
    .poll(
      () =>
        page
          .getByRole("alert")
          .elements()
          .map((n) => n.textContent ?? "")
          .filter(Boolean),
      { timeout },
    )
    .toEqual([]);
}

/**
 * Assert that a locator's text content matches a pattern, polling until it does.
 * Useful for components that update their visible label asynchronously.
 */
export async function expectElementTextToMatch(
  locator:
    | ReturnType<typeof page.getByText>
    | ReturnType<typeof page.getByLabelText>
    | any,
  pattern: RegExp | string,
  timeout = 1000,
) {
  const patt = pattern instanceof RegExp ? pattern : rx(pattern);
  await expect
    .poll(() => locator.element().textContent ?? "", { timeout })
    .toMatch(patt);
}

/**
 * Verify the form is valid (submit enabled) and submit it.
 *
 * @param name - The exact name of the submit button.
 */
export async function checkFormValidityAndSubmit(
  name: string,
  opts?: { timeout?: number },
) {
  const rgx = new RegExp(`^${name}$`, "i");

  const submit = page.getByRole("button", { name: rgx });
  expect(submit).toBeEnabled();

  await expectFormToHaveNoErrors(opts?.timeout);

  await userEvent.click(submit);
}

/**
 * Assert that the submit button with the given name is disabled.
 *
 * @param name - The exact name of the submit button.
 */
export async function submitButtonShouldBeDisabled(name: string) {
  const rgx = new RegExp(`^${name}$`, "i");
  const submit = page.getByRole("button", { name: rgx });

  expect(submit).toBeDisabled();
}

export async function fillAndTab(
  target: Parameters<typeof userEvent.fill>[0],
  value: string,
) {
  // `userEvent.fill` accepts either a Locator or a DOM Element; `expect.element`
  // expects a Locator or an HTMLElement/SVGElement, so narrow at runtime.
  if (target instanceof Element) {
    expect(target as HTMLElement | SVGElement).toBeVisible();
  } else {
    expect(target).toBeVisible();
  }

  await userEvent.fill(target, value);
  await userEvent.tab();
}

/**
 * Fill a field and tab out, asserting the submit button is disabled right before.
 */
export async function fillAndTabEnsuringSubmitDisabled(
  submitName: string,
  target: Parameters<typeof userEvent.fill>[0],
  value: string,
) {
  await submitButtonShouldBeDisabled(submitName);
  await fillAndTab(target, value);
}

/**
 * Fill multiple fields in sequence, asserting the submit button is disabled
 * right before each field fill.
 */
export async function fillFieldsEnsuringSubmitDisabled(
  submitName: string,
  items: Array<
    | { label: string | RegExp; value: string }
    | { locator: Locator; value: string }
  >,
) {
  for (const it of items) {
    const target = "locator" in it ? it.locator : page.getByLabelText(it.label);
    await fillAndTabEnsuringSubmitDisabled(submitName, target, it.value);
  }
}

export type StubRoute = readonly [match: string, payload: unknown];

const okJson = (payload: unknown) =>
  Promise.resolve({
    ok: true,
    json: async () => ({ data: payload }),
  } as unknown);

/**
 * Generic fetch stub for UI tests.
 *
 * Tests can provide only the endpoints they need, while still exercising the real
 * `useCommandHandler` fetch flow.
 */
export function stubFetchRoutes({
  getRoutes = [],
  postRoutes = [],
  defaultGetPayload = [],
}: {
  readonly getRoutes?: readonly StubRoute[];
  readonly postRoutes?: readonly StubRoute[];
  readonly defaultGetPayload?: unknown;
}) {
  vi.stubGlobal(
    "fetch",
    vi.fn().mockImplementation((url: string, init?: RequestInit) => {
      const urlStr = String(url || "");
      const method = String(init?.method ?? "GET").toUpperCase();

      // Debug each fetch invocation
      console.debug("[stubFetchRoutes] fetch called", method, urlStr);

      if (method === "POST") {
        for (const [match, payload] of postRoutes) {
          if (urlStr.includes(match)) {
            // Debug stubbed POST
            console.debug("[stubFetchRoutes] POST matched", match, payload);
            return okJson(payload);
          }
        }
        console.debug("[stubFetchRoutes] POST default response", {});
        return okJson({});
      }

      for (const [match, payload] of getRoutes) {
        if (urlStr.includes(match)) {
          // Debug stubbed GET
          console.debug("[stubFetchRoutes] GET matched", match, payload);
          return okJson(payload);
        }
      }
      console.debug(
        "[stubFetchRoutes] GET default response",
        defaultGetPayload,
      );
      return okJson(defaultGetPayload);
    }),
  );
}

/**
 * Escape a string so it can be safely used inside a RegExp.
 */
export function escapeRegExp(value: unknown) {
  return String(value).replaceAll(/[.*+?^${}()|[\]\\]/g, String.raw`\$&`);
}

/**
 * Create a case-insensitive RegExp from a value, escaping it first.
 */
export function rx(value: unknown) {
  return new RegExp(escapeRegExp(value), "i");
}

/**
 * Create a RegExp escaping multiple parts and joining with flexible whitespace (\s+).
 */
export function rxJoin(...parts: unknown[]) {
  return new RegExp(parts.map(escapeRegExp).join(String.raw`\s+`), "i");
}

/**
 * Create a RegExp that matches the value exactly (anchors) and is case-insensitive.
 */
export function rxExact(value: unknown) {
  return new RegExp(`^${escapeRegExp(value)}$`, "i");
}

/**
 * Build a query key tuple from a controller object.
 */
export function queryKeyFor(controller: {
  task?: string;
  apiEndpoint?: unknown;
}) {
  return [controller.task, controller.apiEndpoint];
}

/**
 * Assert that the currently open popover contains the provided items.
 * Items can be strings (converted via `rx`) or RegExp instances.
 */
export async function expectOpenPopoverToContain(
  items: Array<string | RegExp>,
  timeout = 1000,
) {
  for (const it of items) {
    const pattern = it instanceof RegExp ? it : rx(it);
    await expect
      .poll(() => getOpenPopoverCommandDebugText(), { timeout })
      .toMatch(pattern);
  }
}

/**
 * Open a popover by label and assert listed items are present.
 *
 * @param label
 * @param items -
 * @param opts  -
 */
export async function openPopoverAndExpectByLabel(
  label: RegExp,
  items: Array<string | RegExp>,
  opts?: { withinDialog?: boolean; timeout?: number },
) {
  await openPopoverByLabelText(label, { withinDialog: opts?.withinDialog });
  await expectOpenPopoverToContain(items, opts?.timeout ?? 1000);
}

/**
 * Open a popover by trigger name (regex) and assert listed items are present.
 */
export async function openPopoverAndExpectByTrigger(
  trigger: RegExp,
  items: Array<string | RegExp>,
  timeout = 1000,
) {
  console.log("TRIGGER CATCHED : ", trigger);
  console.log("ITEMS CATCHED : ", items);
  await openPopoverByTriggerName(trigger);
  await expectOpenPopoverToContain(items, timeout);
}

export function getOpenDialogContent(): HTMLElement {
  const dialog = getLastVisibleDialogContent();
  if (!dialog) throw new TypeError("No open dialog content found");
  return dialog;
}

function getLastOpenOrVisible(
  openSelector: string,
  selector: string,
  opts?: { checkOpacity?: boolean },
): HTMLElement | null {
  const open = elQueryAll(undefined, openSelector);
  const lastOpen = open.at(-1);
  if (lastOpen) return lastOpen;

  const contents = elQueryAll(undefined, selector);
  const visible = contents.filter((el) =>
    isElementActuallyVisible(el, { checkOpacity: opts?.checkOpacity ?? false }),
  );
  return visible.at(-1) ?? null;
}

function getLastVisibleDialogContent(): HTMLElement | null {
  // Use the shared helper; for dialogs we don't check opacity (visibility is enough).
  return getLastOpenOrVisible(
    `${SELECTORS.dialogContent}[data-state="open"]`,
    SELECTORS.dialogContent,
    {
      checkOpacity: false,
    },
  );
}

export function isDialogOpen(): boolean {
  return getLastVisibleDialogContent() !== null;
}

export async function waitForDialogState(
  expectedOpen: boolean,
  timeout = 1000,
) {
  await expect.poll(isDialogOpen, { timeout }).toBe(expectedOpen);
}

/**
 * Wait for dialog open/close state and assert that a given text/label is
 * present (or absent) inside the dialog.
 *
 * @param label - string or RegExp to look up inside the dialog
 * @param opts.present - true to assert presence, false to assert absence (default true)
 * @param opts.timeout - poll timeout in ms
 * @param opts.withinDialog - when true, searches only inside the last visible dialog
 */
export async function waitForDialogAndAssertText(
  label: string | RegExp,
  opts?: { present?: boolean; timeout?: number; withinDialog?: boolean },
) {
  const timeout = opts?.timeout ?? 1000;
  const present = opts?.present ?? true;

  // First, make sure the dialog reaches the expected open/closed state.
  await waitForDialogState(present, timeout);
  console.log("DIALOG IS: ", present);
  console.log("LABEL SEARCH IS: ", label);
  await waitForTextToBeAbsent(label, { ...opts, present });
}

/**
 * Poll until the given text/label is absent from the document (or scoped dialog).
 * Use when a nested dialog or a portion of the UI is expected to be removed but
 * other dialogs may remain open.
 *
 * @param label - string or RegExp to find
 * @param opts.timeout - total ms to wait
 * @param opts.withinDialog - when true, searches only inside the last visible dialog
 */
export async function waitForTextToBeAbsent(
  label: string | RegExp,
  opts?: { present?: boolean; timeout?: number; withinDialog?: boolean },
) {
  const timeout = opts?.timeout ?? 1000;
  const present = opts?.present ?? false;

  const scope = opts?.withinDialog
    ? (getLastVisibleDialogContent() ?? document.body)
    : undefined;
  const count = () => {
    try {
      return scope
        ? page.elementLocator(scope).getByText(label).elements().length
        : page.getByText(label).elements().length;
    } catch {
      // If the locator query throws for any reason, treat as "not found".
      return 0;
    }
  };

  await expect
    .poll(() => (present ? count() > 0 : count() === 0), { timeout })
    .toBe(true);
}

export async function waitForPopoverState(
  expectedOpen: boolean,
  timeout = 500,
) {
  await expect.poll(isPopoverOpen, { timeout }).toBe(expectedOpen);
}

function isElementActuallyVisible(
  el: HTMLElement,
  opts?: { checkOpacity?: boolean },
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

/**
 * Count visible elements matching `selector` inside `container` (or the
 * document when `container` is undefined). Uses
 * `isElementActuallyVisible(..., { checkOpacity: true })`.
 */
function countVisibleElements(
  container: Element | null | undefined,
  selector: string,
  opts?: { checkOpacity?: boolean },
): number {
  const els = container
    ? elQueryAll(container, selector)
    : elQueryAll(undefined, selector);
  return els.filter((el) =>
    isElementActuallyVisible(el, { checkOpacity: opts?.checkOpacity ?? true }),
  ).length;
}

/**
 * Given a map of key -> selector, returns an object with visible counts for
 * each key.
 */
function getVisibleCounts(
  container: Element | null | undefined,
  map: Record<string, string>,
) {
  const out: Record<string, number> = {};
  for (const [k, sel] of Object.entries(map)) {
    out[k] = countVisibleElements(container, sel, { checkOpacity: true });
  }
  return out;
}

/**
 * Get a brief visibility info for the first element matching `selector`.
 * Returns { el, visible, text, inputValue } where text/inputValue are
 * truncated to 80 chars when visible, otherwise empty strings.
 */
function getVisibleElementInfo(
  container: Element | null | undefined,
  selector: string,
) {
  const el = elQuery(container, selector);
  const visible = el
    ? isElementActuallyVisible(el, { checkOpacity: true })
    : false;
  const text = visible ? (el?.textContent ?? "").trim().slice(0, 80) : "";
  const inputValue =
    visible && el instanceof HTMLInputElement
      ? (el.value ?? "").trim().slice(0, 80)
      : "";
  return { el, visible, text, inputValue };
}

function isPopoverOpen(): boolean {
  return getOpenPopoverContent() !== null;
}

async function closeOpenPopoverIfAny() {
  if (!isPopoverOpen()) return;

  // Clicking the trigger can be flaky because the popover content may cover it
  // and intercept pointer events. Escape + outside pointerdown is more reliable.
  await userEvent.keyboard("{Escape}");

  try {
    await waitForPopoverState(false, 200);
    return;
  } catch {
    const overlay = elQuery(undefined, SELECTORS.dialogOverlay);
    const dismissTarget =
      (getLastVisibleDialogContent() ? overlay : null) ?? document.body;
    await userEvent.click(dismissTarget);
    await waitForPopoverState(false, 200);
  }
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
        { timeout },
      )
      .toBe(true);
    return true;
  } catch {
    return hasCmdk(getOpenPopoverContent() ?? initial);
  }
}

async function waitForPopoverToCloseOrChange(
  previous: HTMLElement,
  timeout = 400,
) {
  await expect
    .poll(
      () => {
        const now = getOpenPopoverContent();
        return now === null || now !== previous;
      },
      { timeout },
    )
    .toBe(true);
}

function hasCmdk(container: HTMLElement | null): boolean {
  if (!container) return false;
  return elQueryAll(container, SELECTORS.commandRoot).length > 0;
}

function resetCmdkInput(container: HTMLElement): void {
  const cmdkInput = getCommandItem(container);
  if (cmdkInput?.value) {
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

        const empty = elQuery(open, SELECTORS.commandEmpty);
        return empty
          ? isElementActuallyVisible(empty, { checkOpacity: true })
          : false;
      },
      { timeout },
    )
    .toBe(true);
}

type FetchMock = typeof fetch & {
  mock?: {
    calls: unknown[][];
  };
};

function getFetchCallUrl(call: unknown[]): string {
  const urlArg = call[0];
  if (typeof urlArg === "string") return urlArg;
  if (urlArg instanceof URL) return urlArg.toString();
  if (typeof urlArg === "object" && urlArg !== null && "url" in urlArg) {
    const withUrl = urlArg as { url?: unknown };
    return typeof withUrl.url === "string" ? withUrl.url : "";
  }
  return "";
}

function getFetchCallMethodUpper(call: unknown[]): string {
  const init = call[1];
  const m =
    typeof init === "object" && init !== null && "method" in init
      ? (init as { method?: unknown }).method
      : "GET";
  return (typeof m === "string" ? m : "GET").toUpperCase();
}

export function getFetchMock(): FetchMock {
  return globalThis.fetch as FetchMock;
}

export function countFetchCalls(method?: string): number {
  const fetchMock = getFetchMock();
  const calls = fetchMock.mock?.calls ?? [];

  if (!method) return calls.length;

  const upper = method.toUpperCase();
  return calls.filter((c) => getFetchCallMethodUpper(c) === upper).length;
}

export function countFetchCallsByUrl(url: string | RegExp, method?: string) {
  return getFetchCallsByUrl(url, method).length;
}

export function getFetchCallsByUrl(url: string | RegExp, method?: string) {
  const fetchMock = getFetchMock();
  const calls = fetchMock.mock?.calls ?? [];

  const methodUpper = method ? method.toUpperCase() : undefined;

  return calls.filter((c) => {
    const calledUrl = getFetchCallUrl(c);
    const calledMethod = getFetchCallMethodUpper(c);

    const urlMatches =
      typeof url === "string" ? calledUrl.includes(url) : url.test(calledUrl);
    const methodMatches = methodUpper ? calledMethod === methodUpper : true;

    return urlMatches && methodMatches;
  });
}

export function getLastFetchCallByUrl(url: string | RegExp, method?: string) {
  const calls = getFetchCallsByUrl(url, method);
  return calls.at(-1) ?? null;
}

function getFetchCallBodyRaw(call: unknown[]) {
  const init = call[1] as RequestInit | undefined;
  return init?.body;
}

export function getFetchCallJsonBody(call: unknown[]): unknown {
  const raw = getFetchCallBodyRaw(call);

  if (raw == null) return undefined;

  // Most code paths use fetchJSON which sets body to JSON.stringify(payload)
  if (typeof raw === "string") {
    try {
      return JSON.parse(raw);
    } catch {
      return raw;
    }
  }

  // Some environments may pass a plain object.
  if (typeof raw === "object") return raw;

  return raw;
}

export function getLastPostJsonBodyByUrl(url: string | RegExp): unknown {
  const call = getLastFetchCallByUrl(url, "POST");
  if (!call) return null;
  return getFetchCallJsonBody(call);
}

export async function openPopoverByTriggerName(name: RegExp) {
  await openPopover(page.getByRole("button", { name }));
}

function getElementLabelText(el: HTMLElement): string {
  const text = (el.textContent ?? "").trim();
  if (text) return text;

  // cmdk stores the resolved item value on the element.
  const dataValue = el.dataset.value;
  if (dataValue?.trim()) return dataValue.trim();

  const valueAttr = el.getAttribute("value");
  return (valueAttr ?? "").trim();
}

function getSearchScope(withinDialog?: boolean): HTMLElement {
  return (withinDialog ? getLastVisibleDialogContent() : null) ?? document.body;
}

function findLabelElementScoped(label: RegExp, withinDialog?: boolean) {
  const scope = getSearchScope(withinDialog);
  const labelElements = elQueryAll(scope, "label") as HTMLLabelElement[];
  return labelElements.find((el) => label.test((el.textContent ?? "").trim()));
}

function getTriggerFromLabelElement(
  labelElement: HTMLLabelElement,
  label: RegExp,
): HTMLElement {
  // Prefer the built-in association instead of manual document.getElementById.
  // This works for <label for="..."> and nested controls.
  const control = labelElement.control;
  if (control instanceof HTMLElement) return control;

  const container = labelElement.parentElement;
  if (!container)
    throw new TypeError(`Popover container not found for label: ${label}`);

  const trigger =
    elQuery(container, 'button[data-slot="popover-trigger"]') ??
    elQuery(container, "button");

  if (!trigger)
    throw new TypeError(`Popover trigger button not found for label: ${label}`);

  return trigger;
}

export async function clickControlByLabelText(
  label: RegExp,
  opts?: { withinDialog?: boolean },
): Promise<HTMLElement> {
  setLastUiAction("clickControlByLabelText", {
    label: String(label),
    withinDialog: !!opts?.withinDialog,
  });
  const labelElement = findLabelElementScoped(label, opts?.withinDialog);
  if (!labelElement) {
    throw new Error(`Label not found: ${String(label)}`);
  }

  const trigger = getTriggerFromLabelElement(labelElement, label);
  await userEvent.click(trigger);
  return trigger;
}

export async function selectCommandItemInContainer(
  container: HTMLElement,
  pattern: RegExp,
  timeout = 500,
) {
  setLastUiAction("selectCommandItemInContainer", {
    pattern: String(pattern),
    timeout,
  });
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
        return items.some((el) => pattern.test(getElementLabelText(el)));
      },
      { timeout },
    )
    .toBe(true);

  const items = getCommandItemsInContainer(container);
  const target = items.find((el) => pattern.test(getElementLabelText(el)));
  if (!target)
    throw new Error(
      `[ui test] Command item not found for pattern: ${String(pattern)}`,
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

  await userEvent.click(target);

  if (!popoverBeforeSelection) return;

  try {
    await waitForPopoverToCloseOrChange(popoverBeforeSelection, 400);
  } catch {
    // Multi-select popovers stay open; don't fail the test for that.
  }
}

function getCommandItemsInContainer(
  container: Element | null | undefined,
): HTMLElement[] {
  // Most of the app uses shadcn/ui's CommandItem wrapper (data-slot="command-item"),
  // but cmdk also renders raw items with the [cmdk-item] attribute.
  // In some environments, the most stable hook is the ARIA role.
  if (!(container instanceof Element)) return [];
  return elQueryAll(container, SELECTORS.commandItems).filter((el) =>
    isElementActuallyVisible(el),
  );
}

function getCommandItem(
  container: Element | null | undefined,
): HTMLInputElement | null {
  // Most of the app uses shadcn/ui's CommandItem wrapper (data-slot="command-item"),
  // but cmdk also renders raw items with the [cmdk-item] attribute.
  if (!container) return null;

  if (!(container instanceof Element)) return null;
  const el = elQuery(container, SELECTORS.commandInput);
  return el instanceof HTMLInputElement ? el : null;
}

async function selectItemsByPatterns(
  label: RegExp,
  patterns: RegExp[],
  opts?: {
    withinDialog?: boolean;
    timeout?: number;
    beforeEachSelect?: () => Promise<void>;
  },
) {
  const findNewPopover = () => getOpenPopoverContent() ?? document.body;

  let popover = findNewPopover();

  for (const [i, pattern] of patterns.entries()) {
    if (opts?.beforeEachSelect) {
      await opts.beforeEachSelect();
    }
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
  opts?: {
    withinDialog?: boolean;
    items?: RegExp | RegExp[];
    timeout?: number;
    beforeEachSelect?: () => Promise<void>;
  },
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
  await openPopover(trigger, opts?.timeout ?? 500);

  // If no items to select, we're done.
  if (!opts?.items) return;

  const patterns: RegExp[] = Array.isArray(opts.items)
    ? opts.items
    : [opts.items];
  await selectItemsByPatterns(label, patterns, {
    withinDialog: opts?.withinDialog,
    timeout: opts?.timeout,
    beforeEachSelect: opts?.beforeEachSelect,
  });
}

/**
 * Open a popover by label, optionally selecting item(s), asserting the submit
 * button is disabled right before each selection.
 */
export async function openPopoverByLabelTextEnsuringSubmitDisabled(
  submitName: string,
  label: RegExp,
  opts?: {
    withinDialog?: boolean;
    items?: RegExp | RegExp[];
    timeout?: number;
  },
) {
  return openPopoverByLabelText(label, {
    ...opts,
    beforeEachSelect: async () => submitButtonShouldBeDisabled(submitName),
  });
}

/**
 * Select an item in a cmdk/shadcn Command container, asserting the submit
 * button is disabled right before selection.
 */
export async function selectCommandItemInContainerEnsuringSubmitDisabled(
  submitName: string,
  container: HTMLElement,
  pattern: RegExp,
  timeout = 500,
) {
  await submitButtonShouldBeDisabled(submitName);
  return selectCommandItemInContainer(container, pattern, timeout);
}

/**
 * Iterate several popover selections, asserting the submit button is disabled
 * right before each selection. Each entry controls whether we tab after selection.
 */
export async function selectMultiplePopoversEnsuringSubmitDisabled(
  submitName: string,
  selections: Array<{
    label: RegExp;
    items: RegExp | RegExp[];
    withinDialog?: boolean;
    timeout?: number;
    tabAfter?: boolean;
  }>,
) {
  for (const sel of selections) {
    await openPopoverByLabelTextEnsuringSubmitDisabled(submitName, sel.label, {
      withinDialog: sel.withinDialog,
      items: sel.items,
      timeout: sel.timeout,
    });

    // Default behaviour: tab after selection to trigger onBlur/onTouched if needed.
    if (sel.tabAfter ?? true) {
      await userEvent.tab();
    }
  }
}

export async function openPopoverByContainerId(containerId: string) {
  setLastUiAction("openPopoverByContainerId", { containerId });
  const escaped =
    typeof CSS !== "undefined" && "escape" in CSS
      ? CSS.escape(containerId)
      : containerId.replaceAll(/[^a-zA-Z0-9_-]/g, String.raw`\\$&`);

  const container = elQuery(undefined, `#${escaped}`);
  const trigger = elQuery(container, "button");

  [container, trigger].forEach((el, idx) => {
    if (!(el instanceof HTMLElement)) {
      const what = idx === 0 ? "container" : "trigger button";
      throw new TypeError(`Popover ${what} not found: ${containerId}`);
    }
  });

  await openPopover(trigger);
}

async function openPopover(
  trigger: Parameters<typeof userEvent.click>[0] | null,
  timeout = 500,
) {
  // If it's already open (e.g. dialog opened on top), close first so we can
  // re-open and force a re-render with updated cached data.
  await closeOpenPopoverIfAny();

  if (!trigger) throw new TypeError("Popover trigger not found");

  await userEvent.click(trigger);
  await waitForPopoverState(true, timeout);

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
  return getLastOpenOrVisible(
    SELECTORS.popoverContentOpen,
    SELECTORS.popoverContent,
    {
      checkOpacity: true,
    },
  );
}

export function getOpenPopoverCommandItemTexts(): string[] {
  const popover = getOpenPopoverContent();
  if (!popover) return [];

  return getCommandItemsInContainer(popover)
    .map((el) => getElementLabelText(el))
    .filter(Boolean);
}

function getOpenPopoverCommandDebugText(): string {
  const popover = getOpenPopoverContent();
  if (!popover) {
    const all = elQueryAll(undefined, SELECTORS.popoverContent);
    const visibleCount = countVisibleElements(
      undefined,
      SELECTORS.popoverContent,
      { checkOpacity: true },
    );
    const last = all.at(-1) ?? null;
    const lastVisible = last
      ? isElementActuallyVisible(last, { checkOpacity: true })
      : false;

    return `__NO_OPEN_POPOVER__ total=${
      all.length
    } visible=${visibleCount} lastState=${
      last?.dataset.state ?? ""
    } lastVisible=${lastVisible}`;
  }

  const itemTexts = getOpenPopoverCommandItemTexts();
  if (itemTexts.length > 0) return itemTexts.join(" ");

  const selectorMap: Record<string, string> = {
    command: SELECTORS.commandRoot,
    list: SELECTORS.commandList,
    input: SELECTORS.commandInput,
    empty: SELECTORS.commandEmpty,
    slotItems: SELECTORS.commandSlotItem,
    cmdkItems: SELECTORS.cmdkItem,
    roleOptions: SELECTORS.roleOption,
    dataValue: SELECTORS.dataValue,
  };

  const counts = getVisibleCounts(popover, selectorMap);

  const inputInfo = getVisibleElementInfo(popover, SELECTORS.commandInput);
  const emptyInfo = getVisibleElementInfo(popover, SELECTORS.commandEmpty);

  const emptyVisible = emptyInfo.visible;
  const inputVisible = inputInfo.visible;

  const emptyText = emptyInfo.text;
  const inputValue = inputInfo.inputValue;

  return `__EMPTY__ counts=${JSON.stringify(
    counts,
  )} inputVisible=${inputVisible} input="${inputValue}" emptyVisible=${emptyVisible} emptyText="${emptyText}"`;
}

export function getOpenCommandContainer(): HTMLElement {
  const openPopover = getOpenPopoverContent();
  if (openPopover) return openPopover;

  return getLastVisibleDialogContent() ?? document.body;
}
