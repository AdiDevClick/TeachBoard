import type { CommandItemType } from "@/components/Command/types/command.types.ts";
import { DEV_MODE, NO_CACHE_LOGS } from "@/configs/app.config.ts";
import type {
  CreateDisabledGroupParams,
  HandleDiplomaChangeParams,
} from "@/features/class-creation/components/main/types/class-creation.types";
import { UniqueSet } from "@/utils/UniqueSet.ts";

function logResetLookupDebug(items: unknown, id: string | number) {
  if (!DEV_MODE || NO_CACHE_LOGS) return;

  console.log("[Reset ITEM DATA] Looking for ID:", id);
  console.log("[Reset DATA] Items is Map:", items instanceof Map);

  if (items instanceof Map) {
    console.log("[Reset DATA] Map keys:", Array.from(items.keys()));
    return;
  }

  if (Array.isArray(items)) {
    console.log("[Reset DATA] Array length:", items.length);
    return;
  }

  if (typeof items === "object" && items !== null) {
    console.log("[Reset DATA] Object keys:", Object.keys(items));
    return;
  }

  console.log("[Reset DATA] Items type:", typeof items);
}

/**
 * Create a disabled group for already-used tasks
 *
 * @description This copies the proxy while avoiding mutation of the React Query cache.
 *
 * @param dataCopy - The current data copy to modify
 * @param cachedData - The original cached data from React Query
 * @param diplomaDatas - The diploma data containing short templates list
 * @param currentDiplomaId - The current diploma ID
 * @param activeDiplomaIdRef - A ref object to track the active diploma ID
 * @returns The modified data copy with a disabled group for already-used tasks
 */
export function createDisabledGroup({
  dataCopy,
  cachedData,
  diplomaDatas,
}: CreateDisabledGroupParams) {
  // Create a deep copy to avoid mutating the React Query cache
  dataCopy = JSON.parse(JSON.stringify(cachedData));
  // Move already-used tasks into a disabled group
  const disabledSet = new UniqueSet();
  const filteredItems = cachedData[0].items.filter((item) => {
    if (diplomaDatas.shortTemplatesList.includes(String(item.name))) {
      disabledSet.set(item.id, {
        ...item,
        disabled: true,
      });
      return false;
    }

    return true;
  });

  dataCopy[0].items = filteredItems;

  if (disabledSet.size > 0) {
    dataCopy[1] = {
      groupTitle: "Déjà utilisés",
      items: Array.from(disabledSet.values()) as CommandItemType[],
    };
  }
  return dataCopy;
}

/**
 * Handle diploma change by resetting relevant refs and flags
 *
 * @param currentId - The current diploma ID
 * @param activeDiplomaIdValue - The active diploma ID value from ref
 * @param savedSkills - A ref object to track saved skills
 * @param itemToDisplay - A ref object to track the item to display
 * @param isDiplomaChanged - A boolean flag indicating if the diploma has changed
 */
export function handleDiplomaChange({
  currentId,
  activeDiplomaIdRef,
  savedSkills,
  itemToDisplay,
}: HandleDiplomaChangeParams) {
  const activeDiplomaIdValue = activeDiplomaIdRef.current;
  const changed = activeDiplomaIdValue !== currentId;

  if (changed) {
    activeDiplomaIdRef.current = currentId;
    savedSkills.current = null!;
    itemToDisplay.current = null!;

    if (DEV_MODE && !NO_CACHE_LOGS) {
      console.log("Diploma changed to:", currentId);
    }
  }

  return changed;
}

/**
 * Save the provided keys into the given ref object.
 *
 * @description You can then call any query with these keys to get cached data.
 *
 * @param keys - The keys to be saved.
 * @param ref - The ref object where the keys will be stored.
 */
export function saveKeys(
  keys: readonly unknown[],
  ref: { current: Record<string, readonly unknown[]> },
) {
  const key = String(keys[0]);
  ref.current = { ...ref.current, [key]: keys };
}

/**
 * Generates a list of school years within a specified range.
 *
 * @param year - The central year to base the range on.
 * @param range - The number of years to include before and after the central year.
 * @returns An array of objects containing the school year names and IDs.
 */
export function yearsListRange(
  year: number,
  range: number,
): { name: string; id: string }[] {
  const startYear = year - range;
  const endYear = year + range;
  const length = endYear - startYear + 1;
  return Array.from({ length }, (_v, i) => {
    const yearLabel = `${startYear + i} - ${startYear + i + 1}`;
    return {
      name: yearLabel,
      id: yearLabel,
    };
  });
}
