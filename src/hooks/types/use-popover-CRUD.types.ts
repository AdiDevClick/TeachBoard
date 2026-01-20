import type { DynamicTagItemDetails } from "@/components/Tags/types.ts";

/**
 * Props for usePopoverCRUD hook.
 */
export type UsePopoverCRUDProps = {
  onRemove?: (value: string, details?: DynamicTagItemDetails) => void;
};
