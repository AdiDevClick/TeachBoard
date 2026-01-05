import { testQueryClient } from "@/tests/test-utils/AppTestWrapper.tsx";
import { countFetchCalls } from "@/tests/test-utils/vitest-browser.helpers.ts";
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
 * Helper to get the IDs of all cached items for a given query key
 *
 * @param queryKey - query key to retrieve cached items for
 * @returns array of item IDs
 */
export function getCachedItemIds(queryKey: readonly unknown[]): string[] {
  const cached = testQueryClient.getQueryData<CachedGroup[]>(queryKey);
  const ids: string[] = [];

  for (const group of cached ?? []) {
    for (const item of group.items ?? []) {
      if (typeof item.id === "string") ids.push(item.id);
    }
  }

  return ids;
}
