import { calendarEvents } from "@/data/CalendarData";
import { sidebarDatas } from "@/data/SidebarData";

/**
 * Complete sidebar data including calendar events
 *
 * @description This object merges the static sidebar data with
 * dynamic calendar events to provide a comprehensive data set
 * for the sidebar navigation.
 */
export const COMPLETE_SIDEBAR_DATAS = {
  ...sidebarDatas,
  calendarEvents: calendarEvents,
};
