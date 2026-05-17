import {
  isDateRangeSelection,
  isSingleDateSelection,
} from "@/components/Calendar/functions/calendar.functions";
import type { DateSelection } from "@/components/Calendar/types/calendar.types";
import type { EventViewFormSchema } from "@/features/calendar/event-view/models/event-view.models";

/**
 * Serializes a DateSelection (either a single date or a date range) into the format expected by the EventViewFormSchema's date field.
 *
 * @param selection - The date selection to serialize, which can be either a single Date or a DateRange.
 *
 * @returns An object containing either a single date or a date range in ISO string format, or undefined if the selection is invalid.
 */
export function serializeRangeDateSelection(
  selection: DateSelection,
): EventViewFormSchema["date"] | undefined {
  const fromDate = isSingleDateSelection(selection)
    ? selection
    : selection.from;
  const toDate = isSingleDateSelection(selection) ? undefined : selection.to;

  const from = fromDate ? dateToIsoString(fromDate) : undefined;
  const to = toDate ? dateToIsoString(toDate) : undefined;
  const single = from ?? to;

  if (!single) {
    return undefined;
  }

  return {
    single,
    range: from && to ? { from, to } : undefined,
  };
}

/**
 * Convert a Date object to ISO date string (YYYY-MM-DD)
 */
function dateToIsoString(date: Date): string {
  return date.toISOString().split("T")[0];
}

/**
 * Determines the type of a DateSelection (either "single" or "range") based on its structure.
 *
 * @param selection - The date selection to evaluate, which can be either a single Date or a DateRange.
 *
 * @returns A string indicating the type of the selection: "single" for a single date, "range" for a date range, or undefined if the selection is invalid.
 */
export function getType(selection: DateSelection) {
  if (isDateRangeSelection(selection)) {
    return "range";
  }
  if (isSingleDateSelection(selection)) {
    return "single";
  }
}
