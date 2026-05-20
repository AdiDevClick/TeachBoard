import type { EventViewFormSchema } from "@/features/calendar/event-view/models/event-view.models";
import {
  buildDateTimeString,
  parseToPlainTemporal,
} from "@/utils/dates/datetime";

/**
 * Builds the data object to send to Microsoft Graph when creating or updating an event.
 *
 * @description This function takes the form data from the event form and transforms it into the format required by the Microsoft Graph API.
 * It handles both all-day events and timed events, ensuring that midnight schedules are normalized as all-day events to provide a valid exclusive end date.
 *
 * @remark Midnight schedules are normalized as all-day events so the API receives a valid
 * exclusive end date instead of a zero-length range.
 *
 * @param data - The form data containing the event details, including subject, date, time, body content, and all-day status.
 *
 * @return An object formatted according to the Microsoft Graph API requirements, with properly structured start and end date-time values, and an all-day flag if applicable.
 */
export function buildPOSTData(data: EventViewFormSchema) {
  const { start, end, isAllDay, date: { range, single } = {} } = data;

  const isMidnightSchedule = start === "00:00" && end === "00:00";
  const isAllDaySelected = isAllDay ?? isMidnightSchedule;
  const from = range?.from ?? single;
  const to = range?.to ?? single;

  const startDateTime = buildDateTimeString(from, start);
  let endDateTime = buildDateTimeString(to, end);

  if (isAllDaySelected) {
    const selectedEndDate = parseToPlainTemporal(to ?? from, { type: "date" });
    const endDate = selectedEndDate?.add({ days: 1 }).toString();
    endDateTime = buildDateTimeString(endDate, end);
  }

  return {
    subject: data.subject,
    body: {
      content: data.body?.content,
    },
    start: startDateTime,
    end: endDateTime,
    isAllDay: isAllDaySelected,
  };
}
