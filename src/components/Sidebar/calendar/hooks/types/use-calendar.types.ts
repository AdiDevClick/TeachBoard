/**
 * Defines TypeScript types for the useCalendar hook, which manages calendar state and data fetching based on a specified date range.
 *
 * @remarks
 * - The `CalendarFetchRange` type specifies the allowed values for the range of calendar data to fetch (month, week, or day).
 * - The `UseCalendarOptions` type defines the options that can be passed to the `useCalendar` hook, including the initial date and optional fetch configuration.
 */

import type { AppDialogNames } from "@/configs/app.config";
import type {
  ApiEndpointType,
  DataReshapeFn,
} from "@/types/AppInputControllerInterface";

/**
 * Defines the allowed values for the range of calendar data to fetch, which can be "month", "week", or "day".
 */
export type CalendarFetchRange = "month" | "week" | "day";

/**
 * Options for the useCalendar hook, which manages calendar state and data fetching based on a specified date range.
 */
export type UseCalendarOptions = {
  /**
   * The initial date to display in the calendar
   * @default new Date()
   */
  initialDate?: Date;
  /**
   * Optional configuration for fetching calendar events based on a date range, including the start date and the type of range (month, week, or day).
   * If provided, the hook will fetch events for the specified range whenever the date changes.
   */
  fetchRange?: {
    start: Date;
    type: CalendarFetchRange;
  };
  /**
   * Optional string representing the API endpoint to which calendar event data should be submitted when creating or updating events
   */
  submitRoute?: ApiEndpointType;
  /**
   * Optional function to reshape the calendar event data before submission, allowing for custom formatting or additional data manipulation as needed.
   */
  submitDataReshapeFn?: DataReshapeFn;
  /**
   * Optional string representing the page ID to be used in the command handler for fetching and submitting calendar event data, allowing for context-specific handling of calendar-related actions within the application.
   *
   * @default "none"
   */
  pageId?: AppDialogNames;
};
