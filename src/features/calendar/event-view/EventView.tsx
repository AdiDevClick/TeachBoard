import { withVerticalDrawer } from "@/components/HOCs/withVerticalDrawer";
import type { DateFieldProps } from "@/components/Popovers/Date/types/date-field.types";
import { EventViewController } from "@/features/calendar/event-view/controllers/EventViewController";
import { eventInputs } from "@/features/calendar/event-view/form/event-view.inputs";
import {
  eventViewSchema,
  type EventViewFormSchema,
} from "@/features/calendar/event-view/models/event-view.models";
import type { EventViewProps } from "@/features/calendar/event-view/types/event-view.types";
import { useDialog } from "@/hooks/contexts/useDialog";
import { getSelectedDate, transformToTimeString } from "@/utils/dates/datetime";
import { zodResolver } from "@hookform/resolvers/zod";
import { Temporal } from "@js-temporal/polyfill";
import type { Event } from "@microsoft/microsoft-graph-types";
import type { ComponentProps } from "react";
import { useForm } from "react-hook-form";

const now = Temporal.Now.plainTimeISO();

// Build HH:mm string for default time values
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
  const event = useDialog().dialogOptions(pageId)?.event as Event;

  const { subject, isAllDay, start, end, body } = event ?? {};

  const startDate = getSelectedDate(start?.dateTime);
  const endDate = getSelectedDate(end?.dateTime);

  const time = {
    start: transformToTimeString(start?.dateTime) ?? defaultStart,
    end: transformToTimeString(end?.dateTime) ?? defaultEnd,
  };

  const form = useForm<EventViewFormSchema>({
    resolver: zodResolver(eventViewSchema),
    mode: "all",
    defaultValues: {
      subject: subject ?? "",
      isAllDay: isAllDay ?? false,
      date: {
        single: startDate,
        range: {
          from: startDate,
          to: endDate,
        },
      },
      ...time,
      body: {
        content: body?.content ?? undefined,
      },
    },
  });

  const isSameDay = startDate === endDate;
  const resolvedMode: DateFieldProps["mode"] = isSameDay ? "single" : "range";

  const hydratedControllers = {
    ...inputControllers,
    date: {
      ...inputControllers.date,
      mode: resolvedMode,
    },
  };

  const eventProps = {
    form,
    formId: `${pageId}-form`,
    pageId,
    inputControllers: hydratedControllers,
    event,
    drawerHeader: {
      drawerTitle: { label: "Evènement" },
      drawerDescription: {
        label: "Voir ou modifier l'événement",
      },
    },
    drawerFooter: {
      drawerClose: { label: "Fermer" },
      displaySubmitButton: true,
      drawerSubmit: { label: "Enregistrer" },
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
