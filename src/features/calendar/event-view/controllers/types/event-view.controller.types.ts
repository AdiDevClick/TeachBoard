import type { EventViewFormSchema } from "@/features/calendar/event-view/models/event-view.models";
import type { EventViewProps } from "@/features/calendar/event-view/types/event-view.types";
import type { AppControllerInterface } from "@/types/AppControllerInterface";
import type { Event } from "@microsoft/microsoft-graph-types";

/**
 * Props for the EventViewController component.
 */
export type EventViewControllerProps = Readonly<
  AppControllerInterface<EventViewFormSchema> & {
    inputControllers: NonNullable<EventViewProps["inputControllers"]>;
    /** The event data for hydration */
    event?: Event;
  }
>;
