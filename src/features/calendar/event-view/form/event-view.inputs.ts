import type { DateFieldProps } from "@/components/Popovers/Date/types/date-field.types";
import { timeSteps } from "@/features/calendar/event-view/configs/event-view.configs";
import type { EventViewInputItem } from "@/features/calendar/event-view/models/event-view.models";

const eventSubject = {
  name: "subject",
  title: "Sujet",
  type: "text",
  placeholder: "Ex: Le titre de l'événement...",
  autoComplete: "off",
  required: true,
} satisfies EventViewInputItem;

const eventIsAllDay = {
  name: "isAllDay",
  title: "Toute la journée",
  required: true,
} satisfies EventViewInputItem;

const eventTimeRange = {
  start: {
    name: "start",
    label: "Heure de début",
    step: timeSteps,
    required: false,
  },
  end: {
    name: "end",
    label: "Heure de fin",
    step: timeSteps,
    required: false,
  },
} satisfies {
  start: EventViewInputItem;
  end: EventViewInputItem;
};

const date: EventViewInputItem & Omit<DateFieldProps, "control"> = {
  name: "date",
  label: "Date",
  mode: "single",
  placeholder: "Sélectionnez une date",
  fullWidth: true,
  required: true,
};

const bodyContent = {
  name: "body.content",
  title: "Description (optionnelle)",
  type: "text",
  placeholder: "Ex: Description de l'événement...",
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
