/**
 * @fileoverview Types for calendar events in the sidebar calendar component.
 * This file defines the types used for calendar events displayed in the sidebar calendar.
 * It includes the props for individual calendar events, which are based on the CalendarEventView type from the API.
 *
 * @module SidebarCalendarTypes
 */

import type { Button } from "@/components/ui/button";
import type { Event } from "@microsoft/microsoft-graph-types";
import type { ComponentProps, MouseEvent } from "react";

/**
 * Props for a calendar event displayed in the sidebar calendar.
 */
export type CalendarEventProps = Readonly<
  {
    event: Event;
    /**
     * Optional click handler - Receives the mouse event and the calendar event data as parameters.
     * This allows parent components to handle event clicks, such as opening a detailed view of the event.
     */
    onClick?: (
      /** The mouse event - Classic React event */
      e: MouseEvent<HTMLButtonElement>,
      /** The calendar event data - @see Event */
      event: Event,
    ) => void;
  } & Omit<ComponentProps<typeof Button>, "onClick">
>;
