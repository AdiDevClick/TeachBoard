import { withVerticalDrawer } from "@/components/HOCs/withVerticalDrawer";
import { EventViewController } from "@/features/calendar/event-view/controllers/EventViewController";
import type { EventViewProps } from "@/features/calendar/event-view/types/event-view.types";
import { useDialog } from "@/hooks/contexts/useDialog";
import { formatRangeCompat } from "@/utils/utils";
import type { Event } from "@microsoft/microsoft-graph-types";
import type { ComponentProps } from "react";

/**
 * Event View for detailed view of calendar events
 *
 * @description Displays the details of a calendar event in a vertical drawer
 *
 * @param pageId - The ID of the page, used to retrieve the event data from the dialog options
 */
export function EventView({ pageId = "event-view" }: EventViewProps) {
  const event = useDialog().dialogOptions(pageId)?.event as Event;
  const { subject, start, end, isAllDay } = event ?? {};

  let range = "No date information available";

  if (isAllDay) {
    range = "Toute la journée";
  } else {
    range =
      formatRangeCompat(start?.dateTime, end?.dateTime, Boolean(isAllDay)) ??
      range;
  }

  const eventProps = {
    drawerHeader: {
      drawerTitle: { label: subject ?? "Event Details" },
      drawerDescription: { label: range },
    },
    drawerFooter: {
      drawerClose: { label: "Fermer" },
    },
    drawerContent: {
      calendarEvent: event,
    },
  } satisfies ComponentProps<typeof EventDetails>;

  return (
    <EventDetails {...eventProps}>
      <EventDetails.Header />
      <EventDetails.Content />
      <EventDetails.Footer />
    </EventDetails>
  );
}

const EventDetails = withVerticalDrawer(EventViewController);
