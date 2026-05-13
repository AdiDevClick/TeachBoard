import withListMapper from "@/components/HOCs/withListMapper";
import { CalendarEvent } from "@/components/Sidebar/calendar/Event/CalendarEvent";
import { createComponentName } from "@/utils/utils";

/**
 * CalendarEventsList is a component that maps over a list of calendar events and renders a CalendarEvent component for each event. It uses the withListMapper HOC to handle the mapping logic.
 */
export const CalendarEventsList = withListMapper(CalendarEvent);
createComponentName("withListMapper", "CalendarEventsList", CalendarEventsList);
