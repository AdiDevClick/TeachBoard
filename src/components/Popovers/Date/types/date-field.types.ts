import type { CalendarForPopoverProps } from "@/components/Calendar/types/calendar.types";
import type { ControlledPopoverField } from "@/components/Popovers/exports/popover-field.exports";
import type { ComponentProps } from "react";
import type { DateRange } from "react-day-picker";

/**
 * Types for the DateField component, which is a controlled popover field that allows users to select either a single date or a date range.
 */
export type DateFieldState = {
  /** When a single date is selected */
  single?: Date;
  /** When a date range is selected */
  range?: DateRange;
};

export type DateFieldProps = Readonly<
  {
    onSelect?: (date: Date | DateRange | undefined) => void;
    mode?: CalendarForPopoverProps["mode"];
  } & Omit<ComponentProps<typeof ControlledPopoverField>, "triggerContent">
>;
