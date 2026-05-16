import { withVerticalDrawer } from "@/components/HOCs/withVerticalDrawer";
import { EventViewController } from "@/features/calendar/event-view/controllers/EventViewController";
import { eventInputs } from "@/features/calendar/event-view/form/event-view.inputs";
import {
  eventViewSchema,
  type EventViewFormSchema,
} from "@/features/calendar/event-view/models/event-view.models";
import type { EventViewProps } from "@/features/calendar/event-view/types/event-view.types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Temporal } from "@js-temporal/polyfill";
import type { ComponentProps } from "react";
import { useForm } from "react-hook-form";

const now = Temporal.Now.plainDateTimeISO();
const defaultStart = now.toString({ smallestUnit: "minute" });
const defaultEnd = now
  .add({ minutes: 30 })
  .toString({ smallestUnit: "minute" });

/**
 * Event View for detailed view of calendar events
 *
 * @description Displays the details of a calendar event in a vertical drawer
 *
 * @param pageId - The ID of the page, used to retrieve the event data from the dialog options
 */
export function EventView({
  pageId = "event-view",
  inputControllers = eventInputs,
}: EventViewProps) {
  const form = useForm<EventViewFormSchema>({
    resolver: zodResolver(eventViewSchema),
    mode: "all",
    defaultValues: {
      subject: "",
      isAllDay: false,
      start: defaultStart,
      end: defaultEnd,
      body: {
        content: undefined,
      },
    },
  });

  const eventProps = {
    drawerHeader: {
      drawerTitle: { label: "Evènement" },
      // drawerTitle: { label: subject ?? "Event Details" },
      // drawerDescription: { label: range },
      drawerDescription: {
        label: "Voir ou modifier l'événement",
      },
    },
    drawerFooter: {
      drawerClose: { label: "Fermer" },
    },
    drawerContent: {
      form,
      pageId,
      inputControllers,
      formId: `${pageId}-form`,
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
