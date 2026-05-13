import type { Event } from "@microsoft/microsoft-graph-types";

/**
 * Interface for representing calendar events response
 */
export interface CalendarEvents {
  /**
   * This will show The URI used with metadata of the user as tenant
   */
  "@odata.context": string;
  /**
   * All events
   *
   * @default []
   */
  value: Event[];
}
