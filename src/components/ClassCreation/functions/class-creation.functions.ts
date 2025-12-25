import { DEV_MODE, NO_CACHE_LOGS } from "@/configs/app.config.ts";
import type { useQueryClient } from "@tanstack/react-query";

/**
 * Reset selected items in cache
 *
 * @param queryKey - The query key to access cached data
 * @param selectedItems - The items that have been selected and need to be reset in the cache
 * @param queryClient - The query client instance used to access and manipulate the cache
 */
export function resetSelectedItemsFromCache(
  queryKey: [string, string],
  selectedItems: Record<string, unknown>,
  queryClient: ReturnType<typeof useQueryClient>
) {
  if (!queryKey) return;
  const cachedData = queryClient.getQueryData(queryKey);
  if (!cachedData || !Array.isArray(cachedData) || !cachedData[0]?.items)
    return;

  if (DEV_MODE && !NO_CACHE_LOGS) {
    console.log("[Reset DATA] Cached data structure:", cachedData);
    console.log(
      "[Reset DATA] Items type:",
      cachedData[0].items.constructor.name
    );
    console.log("[Reset DATA] Items to reset:", selectedItems);
  }

  Object.values(selectedItems ?? []).forEach((itemDetails: any) => {
    const items = cachedData[0].items;
    let cachedItem;

    if (DEV_MODE && !NO_CACHE_LOGS) {
      console.log("[Reset ITEM DATA] Looking for ID:", itemDetails.id);
      console.log("[Reset DATA] Items is Map:", items instanceof Map);
      if (items instanceof Map) {
        console.log("[Reset DATA] Map keys:", Array.from(items.keys()));
      } else if (Array.isArray(items)) {
        console.log("[Reset DATA] Array length:", items.length);
      } else {
        console.log("[Reset DATA] Object keys:", Object.keys(items));
      }
    }
    if (Array.isArray(items)) {
      cachedItem = items.find((item: any) => item.id === itemDetails.id);
    }

    if (DEV_MODE && !NO_CACHE_LOGS) {
      console.log("[Reset DATA] Found cached item:", cachedItem);
    }

    if (cachedItem) {
      cachedItem.isSelected = false;
    }
  });
}
