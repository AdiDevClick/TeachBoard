import type {
  DynamicTagsSetters,
  DynamicTagsState,
} from "@/components/Tags/types/tags.types";

/**
 * Expected item details for the popover.
 */
export type PopoverItem = {
  value?: string;
  itemDetails?: DynamicTagsState;
};

/**
 * Props for usePopoverCRUD hook.
 */
export type UsePopoverCRUDProps = PopoverItem & DynamicTagsSetters;
