import type { DateFieldProps } from "@/components/Popovers/Date/types/date-field.types";
import type { EventViewControllerProps } from "@/features/calendar/event-view/controllers/types/event-view.controller.types";
import type { EventViewFormSchema } from "@/features/calendar/event-view/models/event-view.models";
import type { UseFormReturn } from "react-hook-form";

/**
 * EventScheduleFields component for displaying and editing the date and time of a calendar event.
 */
export type EventScheduleFieldsProps = Readonly<{
  form: UseFormReturn<EventViewFormSchema>;
  timeRange?: EventViewControllerProps["inputControllers"]["timeRange"];
  dateInput?: EventViewControllerProps["inputControllers"]["date"];
  mode?: DateFieldProps["mode"];
}>;
