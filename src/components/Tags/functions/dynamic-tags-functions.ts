import type {
  DynamicTagsProps,
  DynamicTagsState,
  StateDetails,
} from "@/components/Tags/types/tags.types";
import { UniqueSet } from "@/utils/UniqueSet";
import type { Dispatch, SetStateAction } from "react";

/**
 * Update the animation stack for dynamic tags
 *
 * @param stateSetter - The state setter function for renderItems
 * @param itemList - The current list of items to be rendered as tags
 * @param renderItems - The current state of rendered items, used to determine which items are new, existing, or exiting
 *
 * @description This function updates the renderItems state based on the incoming itemList.
 * This :
 *  - adds new items,
 *  - keeps existing items,
 *  - marks items that are no longer present for exit animation.
 */
export function updateAnimationStack(
  stateSetter: Dispatch<SetStateAction<DynamicTagsState>>,
  itemList: DynamicTagsProps["itemList"],
  renderItems: DynamicTagsState = new UniqueSet(),
) {
  const next = renderItems.clone();
  const seen = new Set<string>();

  const incomingEntries = Array.isArray(itemList)
    ? itemList
    : Object.entries(itemList ?? {});

  for (const [key] of incomingEntries) {
    seen.add(key);
    const existing = next.get(key);

    if (next.has(key) && !existing?.isExiting) {
      continue;
    }

    const nextEntry = {
      ...existing,
      isExiting: false,
    } as StateDetails;

    next.set(key, nextEntry);
  }
  for (const [key, existing] of renderItems.entries()) {
    if (!seen.has(key) && !existing?.isExiting) {
      next.set(key, {
        ...existing,
        isExiting: true,
      });
    }
  }

  stateSetter(next);
}
