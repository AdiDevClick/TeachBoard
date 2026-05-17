import type { DateSelection } from "@/components/Calendar/types/calendar.types";
import { formatDate } from "@/utils/dates/datetime";
import type { DateRange } from "react-day-picker";

/**
 * Utility function to generate the display string for the date selection in the DateField component.
 *
 * @description
 * - For a range selection, it will return a string in the format "from - to".
 * - For a single date selection, it will return the formatted date string.
 * - If no date is selected, it will return a placeholder string.
 *
 * @param date - The date selection which can be either a single date or a date range.
 * @returns A formatted string representing the selected date(s) to be displayed in the DateField input.
 */
export function formatSelectString(date?: DateSelection) {
  if (!date) {
    return "Sélectionnez une date";
  }

  if (isDateRangeSelection(date)) {
    const displayPlaceholder = (phase: string) =>
      `Sélectionnez une date de ${phase}`;

    if (!date.from) {
      return displayPlaceholder("début");
    }
    if (!date.to) {
      return displayPlaceholder("fin");
    }

    const from = formatDate(date.from);
    const to = formatDate(date.to);

    return `${from} - ${to}`;
  } else if (isSingleDateSelection(date)) {
    return formatDate(date);
  }
}

export function isSingleDateSelection(value?: DateSelection): value is Date {
  return value instanceof Date;
}

export function isDateRangeSelection(
  value?: DateSelection,
): value is DateRange {
  return !(value instanceof Date);
}
