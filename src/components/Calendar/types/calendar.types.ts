import { Calendar } from "@/components/ui/calendar";
import type { ComponentProps } from "react";
import type { DateRange, OnSelectHandler } from "react-day-picker";

export type DateSelection = Date | DateRange;

/**
 * Props for the CalendarForPopover component
 */
export type CalendarForPopoverProps = Omit<
  ComponentProps<typeof Calendar>,
  "onSelect"
> & {
  /** Handler for when a date is selected */
  onSelect?: ((date?: DateSelection) => void) | OnSelectHandler<DateSelection>;
  /** Controlled selected value (single date or range) */
  selected?: DateSelection;
};
