import { expect } from "vitest";
import { page, userEvent } from "vitest/browser";

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

function findLabelElementScoped(
  label: RegExp,
  withinDialog?: boolean
): HTMLLabelElement | undefined {
  if (withinDialog) {
    const dialogContents = Array.from(
      document.querySelectorAll<HTMLElement>('[data-slot="dialog-content"]')
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
    const scope = lastVisibleDialog ?? document.body;
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
  await expect
    .poll(
      () => {
        const items = Array.from(
          container.querySelectorAll<HTMLElement>('[data-slot="command-item"]')
        );
        return items.some((el) => pattern.test(el.textContent ?? ""));
      },
      { timeout }
    )
    .toBe(true);

  const items = Array.from(
    container.querySelectorAll<HTMLElement>('[data-slot="command-item"]')
  );
  const target = items.find((el) => pattern.test(el.textContent ?? ""));
  if (!target)
    throw new Error(
      `[ui test] Command item not found for pattern: ${String(pattern)}`
    );

  const input = container.querySelector<HTMLInputElement>(
    '[data-slot="command-input"]'
  );
  const maybeButton = target.querySelector("button");
  if (maybeButton instanceof HTMLButtonElement) {
    // Prefer DOM click to avoid Playwright actionability hangs in iframe.
    maybeButton.click();
    return;
  }

  if (input) {
    const query = (target.textContent ?? "").trim();

    // In vitest-browser (iframe), Playwright actionability can make clicks on
    // inputs flaky; focusing is enough for typing.
    try {
      input.focus();
    } catch {
      // Fallback to userEvent if focus throws for any reason.
      await userEvent.click(input);
    }
    await userEvent.clear(input);
    await userEvent.type(input, query);
    await userEvent.keyboard("{ArrowDown}{Enter}");
    return;
  }

  if (target instanceof HTMLElement) {
    target.click();
    return;
  }

  await userEvent.click(target);
}

async function selectItemsByPatterns(
  label: RegExp,
  patterns: RegExp[],
  opts?: { withinDialog?: boolean; timeout?: number }
) {
  const findNewPopover = () =>
    document.querySelector<HTMLElement>(
      '[data-slot="popover-content"][data-state="open"]'
    ) ?? document.body;

  let popover = findNewPopover();

  for (const [i, pattern] of patterns.entries()) {
    await selectCommandItemInContainer(popover, pattern, opts?.timeout ?? 500);

    const stillOpen =
      document.querySelector(
        '[data-slot="popover-content"][data-state="open"]'
      ) === popover;
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
  const isOpen = () =>
    document.querySelector(
      '[data-slot="popover-content"][data-state="open"]'
    ) !== null;

  const isDialogOpen = () =>
    document.querySelector(
      '[data-slot="dialog-content"][data-state="open"]'
    ) !== null;

  // If it's already open (e.g., dialog opened on top), close first so we can
  // re-open and force a re-render with updated cached data.
  if (isOpen()) {
    // When a dialog is open, Escape may close the dialog instead of the popover.
    // Prefer clicking outside (dialog overlay/body) to dismiss only the popover.
    if (isDialogOpen()) {
      const overlay = document.querySelector<HTMLElement>(
        '[data-slot="dialog-overlay"]'
      );

      try {
        (overlay ?? document.body).click();
      } catch {
        await userEvent.click(overlay ?? document.body);
      }

      await expect.poll(isOpen).toBe(false);
    } else {
      // Clicking the trigger can be flaky because the popover content may cover it
      // and intercept pointer events. Escape + outside click is more reliable.
      await userEvent.keyboard("{Escape}");

      try {
        await expect.poll(isOpen).toBe(false);
      } catch {
        await userEvent.click(document.body);
        await expect.poll(isOpen).toBe(false);
      }
    }
  }

  // Prefer direct DOM click when possible to avoid Playwright's strict
  // actionability checks (which can be flaky in the vitest browser iframe).
  if (trigger instanceof HTMLElement) {
    trigger.click();
  } else {
    await userEvent.click(trigger);
  }
  await expect.poll(isOpen).toBe(true);
}

export function getOpenPopoverContent(): HTMLElement | null {
  return document.querySelector<HTMLElement>(
    '[data-slot="popover-content"][data-state="open"]'
  );
}

export function getOpenPopoverCommandItemTexts(): string[] {
  const popover = getOpenPopoverContent();
  if (!popover) return [];

  return Array.from(popover.querySelectorAll('[data-slot="command-item"]'))
    .map((el) => (el.textContent ?? "").trim())
    .filter(Boolean);
}

export function getOpenCommandContainer(): HTMLElement {
  const openPopover = getOpenPopoverContent();
  if (openPopover) return openPopover;

  const dialogContents = Array.from(
    document.querySelectorAll<HTMLElement>('[data-slot="dialog-content"]')
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

  return lastVisibleDialog ?? document.body;
}
