import { testQueryClient } from "@/tests/test-utils/testQueryClient.ts";
import {
  countFetchCalls,
  countFetchCallsByUrl,
  expectOpenPopoverToContain,
  openPopoverAndExpectByLabel,
  openPopoverAndExpectByTrigger,
  openPopoverByContainerId,
} from "@/tests/test-utils/vitest-browser.helpers.ts";
import type { CachedGroup, DialogOptions } from "@/tests/types/tests.types.ts";
import { wait } from "@/utils/utils.ts";
import { expect } from "vitest";

/**
 * Creates and returns a click MouseEvent
 *
 * @returns - a MouseEvent representing a click
 */
export function click() {
  return new MouseEvent("click");
}

/**
 * Waits for the dialog options to have a queryKey set
 *
 * @param getDialogOptions - function that retrieves the dialog options
 * @returns - the dialog options with a queryKey
 * @throws - if the wait times out after 2 seconds
 */
export async function waitForQueryKey(
  getDialogOptions: () => DialogOptions
): Promise<DialogOptions> {
  const start = Date.now();
  while (true) {
    const dialogOptions = getDialogOptions();
    if (dialogOptions?.queryKey) return dialogOptions;

    if (Date.now() - start > 2000)
      throw new Error("Timed out waiting for dialog queryKey");
    await wait(10);
  }
}

/**
 * Waits for the queryClient to have cached data for the given key
 *
 * @param key - query key to check for cached data
 * @returns - the cached data
 * @throws - if the wait times out after 4 seconds
 */
export async function waitForCache(key: readonly unknown[]) {
  const start = Date.now();
  while (true) {
    const cached = testQueryClient.getQueryData(key);

    if (cached) return cached;

    if (Date.now() - start > 1000)
      throw new Error("Timed out waiting for cache");

    await wait(20);
  }
}

/**
 * Wait until the expected number of POST calls have been made.
 *
 * @param expectedCount - The expected number of POST calls (default is 1).
 */
export async function waitForPost(expectedCount = 1) {
  await expect
    .poll(() => countFetchCalls("POST"), { timeout: 1000 })
    .toBe(expectedCount);
}

/**
 * Wait until the cached items for the given query key reach the expected length.
 *
 * @param queryKey - The query key to check in the cache
 * @param length - The expected length of items in the cache
 */
export async function waitForItemsLength(
  queryKey: readonly unknown[],
  length: number
) {
  await expect
    .poll(
      () => {
        const cached = testQueryClient.getQueryData<CachedGroup[]>(queryKey);
        return cached?.[0]?.items?.length ?? 0;
      },
      { timeout: 1000 }
    )
    .toBe(length);
}

/**
 * Assert that after a creation POST, the provided queryKey is updated in cache
 * with an item matching `expectedValue` and that no extra GET was performed
 * on the given `endpoint` (count unchanged compared to `getCallsBefore`).
 */
export async function assertPostUpdatedCacheWithoutExtraGet(opts: {
  queryKey: readonly unknown[];
  expectedValue?: string; // item.value expected to appear in cache
  endpoint?: string | RegExp;
  getCallsBefore?: number; // count of GET calls recorded before POST
  timeout?: number;
  /** Optional: wait for a POST to a specific endpoint before checking cache */
  post?: {
    endpoint: string | RegExp;
    count?: number;
    timeout?: number;
    callsBefore?: number;
  };
  /** Optional visual check: open popover and assert item is visible */
  openPopover?: {
    label?: RegExp;
    trigger?: RegExp;
    containerId?: string;
    withinDialog?: boolean;
  };
}) {
  const timeout = opts.timeout ?? 1000;

  // If a specific POST endpoint was provided, wait for the POST(s) to occur first.
  if (opts.post) {
    const postCount = opts.post.count ?? 1;
    const postTimeout = opts.post.timeout ?? timeout;

    const postCallsBefore = opts.post.callsBefore;
    await expect
      .poll(
        () => {
          const current = countFetchCallsByUrl(opts.post!.endpoint, "POST");
          if (postCallsBefore !== undefined) {
            return current + postCallsBefore <= postCount;
          }
          return current === postCount;
        },
        {
          timeout: postTimeout,
        }
      )
      .toBe(true);
  }

  // Wait for cache to be populated
  await expect
    .poll(
      () => {
        const cached = testQueryClient.getQueryData<CachedGroup[]>(
          opts.queryKey
        );
        return cached ?? null;
      },
      { timeout }
    )
    .toBeTruthy();

  // Optional check for expectedValue existence
  if (opts.expectedValue) {
    await expect
      .poll(
        () => {
          const cached = testQueryClient.getQueryData<CachedGroup[]>(
            opts.queryKey
          );
          if (!cached) return false;
          return (
            cached[0]?.items?.some(
              (i: any) => i?.value === opts.expectedValue
            ) ?? false
          );
        },
        { timeout }
      )
      .toBe(true);
  }

  // If getCallsBefore provided, assert no additional GET was made
  if (typeof opts.getCallsBefore === "number") {
    if (opts.endpoint === undefined) {
      // Fallback: assert global GET call count unchanged
      expect(countFetchCalls("GET")).toBe(opts.getCallsBefore);
    } else {
      expect(countFetchCallsByUrl(opts.endpoint, "GET")).toBe(
        opts.getCallsBefore
      );
    }
  }

  // Optional: open a popover and assert the new item is visible
  if (opts.openPopover) {
    if (!opts.expectedValue)
      throw new Error(
        "assertPostUpdatedCacheWithoutExtraGet: expectedValue is required when openPopover is used"
      );

    const op = opts.openPopover;

    if (op.label) {
      console.log("checking label");
      await openPopoverAndExpectByLabel(op.label, [opts.expectedValue], {
        withinDialog: !!op.withinDialog,
        timeout,
      });
    } else if (op.trigger) {
      console.log("checking trigger");
      await openPopoverAndExpectByTrigger(
        op.trigger,
        [opts.expectedValue],
        timeout
      );
    } else if (op.containerId) {
      console.log("checking containerId");
      await openPopoverByContainerId(op.containerId);
      await expectOpenPopoverToContain([opts.expectedValue], timeout);
    }
  }
}
