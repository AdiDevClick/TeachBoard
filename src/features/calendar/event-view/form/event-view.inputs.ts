import type { DateFieldProps } from "@/components/Popovers/Date/types/date-field.types";
import { timeSteps } from "@/features/calendar/event-view/configs/event-view.configs";
import type { EventViewInputItem } from "@/features/calendar/event-view/models/event-view.models";

const eventSubject = {
  name: "subject",
  title: "Sujet",
  type: "text",
  placeholder: "Ex: Le titre de l'événement...",
  autoComplete: "off",
  // apiEndpoint: API_ENDPOINTS.POST.CALENDAR_EVENT.endpoints.MAIN,
  // task: "event-subject",
  required: true,
} satisfies EventViewInputItem;

const eventIsAllDay = {
  name: "isAllDay",
  title: "Toute la journée",
  type: "checkbox",
  // task: "event-isAllDay",
  // apiEndpoint: API_ENDPOINTS.POST.CALENDAR_EVENT.endpoints.MAIN,
  required: false,
} satisfies EventViewInputItem;

const eventTimeRange = {
  start: {
    name: "start",
    label: "Heure de début",
    // type: "time",
    step: timeSteps,
    // apiEndpoint: API_ENDPOINTS.POST.CALENDAR_EVENT.endpoints.MAIN,
    // task: "event-start",
    required: false,
  },
  end: {
    name: "end",
    label: "Heure de fin",
    step: timeSteps,
    // type: "time",
    // apiEndpoint: API_ENDPOINTS.POST.CALENDAR_EVENT.endpoints.MAIN,
    // task: "event-end",
    required: false,
  },
} satisfies {
  start: EventViewInputItem;
  end: EventViewInputItem;
};

const date = {
  name: "date",
  label: "Date",
  mode: "single",
  // multiSelection: true,
  placeholder: "Sélectionnez une date",
  fullWidth: true,
  // apiEndpoint: API_ENDPOINTS.POST.CALENDAR_EVENT.endpoints.MAIN,
  // task: "event-date",
  required: false,
} satisfies EventViewInputItem & Omit<DateFieldProps, "control">;

const bodyContent = {
  name: "body.content",
  title: "Description (optionnelle)",
  type: "text",
  placeholder: "Ex: Description de l'événement...",
  // apiEndpoint: API_ENDPOINTS.POST.CALENDAR_EVENT.endpoints.MAIN,
  // task: "event-content",
  required: false,
} satisfies EventViewInputItem;

export const eventInputs = {
  subject: eventSubject,
  isAllDay: eventIsAllDay,
  timeRange: eventTimeRange,
  bodyContent,
  date,
} satisfies {
  subject: EventViewInputItem;
  isAllDay: EventViewInputItem;
  timeRange: {
    start: EventViewInputItem;
    end: EventViewInputItem;
  };
  bodyContent: EventViewInputItem;
  date: EventViewInputItem & Omit<DateFieldProps, "control">;
};
