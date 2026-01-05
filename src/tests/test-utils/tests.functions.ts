import { testQueryClient } from "@/tests/test-utils/AppTestWrapper.tsx";
import type { DialogOptions } from "@/tests/types/tests.types.ts";
import { wait } from "@/utils/utils.ts";

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

    if (Date.now() - start > 4000)
      throw new Error("Timed out waiting for cache");

    await wait(20);
  }
}
