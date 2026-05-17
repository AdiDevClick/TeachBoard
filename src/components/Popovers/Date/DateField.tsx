import { useFieldStore } from "@/api/store/FieldStore";
import { CalendarForPopover } from "@/components/Calendar/CalendarForPopover";
import { formatSelectString } from "@/components/Calendar/functions/calendar.functions";
import {
  getType,
  serializeRangeDateSelection,
} from "@/components/Popovers/Date/functions/date-field.functions";
import type {
  DateFieldProps,
  DateFieldState,
} from "@/components/Popovers/Date/types/date-field.types";
import { ControlledPopoverField } from "@/components/Popovers/exports/popover-field.exports";
import { useState } from "react";
import type { DateRange } from "react-day-picker";

/**
 * A Date field selection that integrates a calendar popover for selecting either a single date or a date range, depending on the specified mode.
 *
 * @remark It uses react-hook-form for form state management and allows for controlled input through props.
 *
 * @param onSelect - Callback function that is called when a date or date range is selected from the calendar popover.
 * @param onValueChange - Callback function that is called when the internal value changes, providing the serialized date selection.
 * @param mode - Determines whether the calendar allows for single date selection or range selection. Defaults to "single".
 */
export function DateField({
  onSelect,
  onValueChange,
  mode = "single",
  ...props
}: DateFieldProps) {
  const { getValue } = useFieldStore(false, props.resetKey, props.name);
  const [date, setDate] = useState<DateFieldState>({
    range: undefined,
    single: undefined,
  });
  /**
   * Handles the selection of a date or date range from the calendar popover, updating the internal state and notifying parent components through callbacks.
   *
   * @param date - The selected date or date range from the calendar popover.
   */
  const onCalendarSelect = (date: Date | DateRange | undefined) => {
    if (!date) return;

    const type = getType(date);

    setDate((prev) => {
      if (!type) return prev;
      return { ...prev, [type]: date };
    });

    onValueChange?.(serializeRangeDateSelection(date), { mode });
    onSelect?.(date);
  };

  const selectedValue = getValue()
    ? formatSelectString(date.range ?? date.single)
    : undefined;

  const placeholder =
    mode === "range" ? "Sélectionnez une date de début" : props.placeholder;

  return (
    <ControlledPopoverField
      {...props}
      name={props.name ?? "event-date"}
      multiSelection={mode === "range"}
      placeholder={selectedValue ?? placeholder}
    >
      <CalendarForPopover
        mode={mode}
        selected={mode === "range" ? date.range : date.single}
        onSelect={onCalendarSelect}
        className="w-full"
        captionLayout="dropdown"
        required
      />
    </ControlledPopoverField>
  );
}
