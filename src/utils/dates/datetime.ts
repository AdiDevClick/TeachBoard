import type { CalendarFetchRange } from "@/components/Sidebar/calendar/hooks/useCalendar";
import { LANGUAGE } from "@/configs/app.config";
import { Temporal } from "@js-temporal/polyfill";

export function parsePlainDateTime(value?: string) {
  if (!value) return null;

  try {
    return Temporal.PlainDateTime.from(value);
  } catch {
    return null;
  }
}

export function toLocalDate(value: Temporal.PlainDate) {
  return new Date(value.year, value.month - 1, value.day);
}

/**
 * Format a Date object into a localized date string in the format "day month year" (e.g., "01 January 2024").
 *
 * @param date - The Date object to format
 *
 * @return A localized date string formatted as "day month year"
 *
 * @example
 * ```ts
 * const date = new Date(2024, 0, 1); // January is month 0 in JavaScript Date
 * ```
 */
export function formatDate(date: Date) {
  if (!date || !(date instanceof Date)) return "";

  return date.toLocaleDateString(LANGUAGE, {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

/**
 * Build a pair of UTC ISO strings representing the start and end of the
 * selected local calendar day.
 *
 * @param date - The selected local date.
 * @returns An object containing UTC start/end instants for Graph calendarView.
 */
export function getLocalCalendarViewRange(
  date: Date,
  viewType?: CalendarFetchRange,
) {
  const instant = date.toTemporalInstant();
  const options = new Intl.DateTimeFormat().resolvedOptions();
  const zdt = instant.toZonedDateTimeISO(options.timeZone);

  // Defaults to current day
  let effectiveZdt = zdt.startOfDay();
  let endZdt = effectiveZdt.add({ days: 1 });

  // Get the day corresponding to the start of the calendar view, depending on the view type (month/week/day)

  // first & last day of the month
  if (viewType === "month") {
    effectiveZdt = zdt.with({ day: 1 }).startOfDay();
    endZdt = effectiveZdt.add({ months: 1 });
  }

  // first & last day of the selected day week (assuming week starts on Monday)
  if (viewType === "week") {
    effectiveZdt = zdt.subtract({ days: (zdt.dayOfWeek + 6) % 7 }).startOfDay();
    endZdt = effectiveZdt.add({ days: 7 });
  }

  return {
    start: effectiveZdt.toInstant().toString(),
    end: endZdt.toInstant().toString(),
  };
}

export function fromLocalDate(value: Date) {
  return Temporal.PlainDate.from({
    year: value.getFullYear(),
    month: value.getMonth() + 1,
    day: value.getDate(),
  });
}

export function getTimeValue(value?: string) {
  const parsed = parsePlainDateTime(value);

  if (!parsed) return "";

  return `${String(parsed.hour).padStart(2, "0")}:${String(
    parsed.minute,
  ).padStart(2, "0")}`;
}

export function composeDateTime(date: Temporal.PlainDate, time?: string) {
  if (!time) return undefined;

  const [hourText, minuteText] = time.split(":");
  const hour = Number(hourText);
  const minute = Number(minuteText);

  if (
    Number.isNaN(hour) ||
    Number.isNaN(minute) ||
    hour < 0 ||
    hour > 23 ||
    minute < 0 ||
    minute > 59
  ) {
    return undefined;
  }

  return Temporal.PlainDateTime.from({
    year: date.year,
    month: date.month,
    day: date.day,
    hour,
    minute,
  }).toString({ smallestUnit: "minute" });
}

export function getSelectedDate(start?: string, end?: string) {
  const parsedStart = parsePlainDateTime(start);
  const parsedEnd = parsePlainDateTime(end);

  return (
    parsedStart?.toPlainDate() ??
    parsedEnd?.toPlainDate() ??
    Temporal.Now.plainDateISO()
  );
}

/**
 * Format a date range for display.
 *
 * @description If you pass the `isAllDay` flag as true, the function will return an empty string regardless of the actual time range
 *
 * @param from Start date
 * @param to End date
 * @param isAllDay Whether the event is an all-day event, which may affect formatting
 *
 * @returns Formatted date range string
 */
export function formatRangeCompat(from = "", to = "", isAllDay = false) {
  try {
    if (isAllDay || !from || !to) {
      return "";
    }

    const fromDate = Temporal.PlainDateTime.from(from);
    const toDate = Temporal.PlainDateTime.from(to);

    const dtf = new Intl.DateTimeFormat(LANGUAGE, {
      hour: "numeric",
      minute: "2-digit",
    });

    return dtf.formatRange(fromDate, toDate);
  } catch (e) {
    console.log(e);
    // Some environments may throw if Intl is restricted—ignore and fallback
  }
}

/**
 * Calculate the duration of an event from its start and end times, returning a human-readable string.
 *
 * @description If you pass the `isAllDay` flag as true, the function will return "Toute la journée" regardless of the actual time range
 *
 * @remark This uses Temporal API to calculate the duration and Intl.DurationFormat to format it
 *
 * @param from - The start time of the event, as an ISO string
 * @param to - The end time of the event, as an ISO string
 * @param isAllDay - Whether the event is an all-day event
 *
 * @returns A human-readable string representing the duration of the event (e.g., "2h 30m"), or "Toute la journée" if it's an all-day event
 */
export function getDurationFromRange(
  from: string = "",
  to: string = "",
  isAllDay = false,
) {
  const fromDate = Temporal.PlainDateTime.from(from);
  const toDate = Temporal.PlainDateTime.from(to);

  if (isAllDay) {
    return "Toute la journée";
  }

  const range = fromDate.until(toDate, { largestUnit: "day" });
  const rounded = range.round({ largestUnit: "hour", relativeTo: fromDate });

  const formatter = new Intl.DurationFormat("fr", {
    style: "short",
  });

  return formatter.format(rounded);
}

/**
 * Create a display string for a date to be shown in a drawer, formatted in French locale and including only the date and time up to minutes.
 *
 * @param date - The date string to format
 *
 * @returns A formatted date string for display in a drawer, or an empty string if the input date is undefined
 *
 * @example
 * ```ts
 * const dateStr = "2024-12-31T14:30:00Z";
 * const displayDate = createDrawerDisplayDate(dateStr);
 * console.log(displayDate); // "31 décembre 2024 à 14:30"
 * ```
 */
export function createDrawerDisplayDate(date?: string) {
  if (!date) return "";
  return new Date(date)
    .toLocaleString("fr-FR")
    .replace(" ", " à ")
    .split(":")
    .slice(0, 2)
    .join(":");
}
