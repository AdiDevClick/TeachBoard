import type {
  DynamicTagsSetters,
  StateDetails,
} from "@/components/Tags/types/tags.types";

/**
 * Expected item details for the popover.
 */
export type PopoverItem = {
  value?: string;
  itemDetails?: StateDetails;
};

/**
 * Props for usePopoverCRUD hook.
 */
export type UsePopoverCRUDProps = PopoverItem & DynamicTagsSetters;
