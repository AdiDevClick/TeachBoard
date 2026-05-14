import type { Event } from "@microsoft/microsoft-graph-types";

export type EventViewControllerProps = Readonly<{
  calendarEvent: Event;
}>;

export function EventViewController({
  calendarEvent = {},
}: EventViewControllerProps) {
  const { subject = "No subject available", start, end } = calendarEvent;
  return (
    <div>
      <h1>Event View Controller</h1>
      <p>{subject}</p>
      <p>{start?.dateTime}</p>
      <p>{end?.dateTime}</p>
    </div>
  );
}
