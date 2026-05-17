/**
 * This file contains utility functions for the SidebarCalendar component, which is responsible for displaying calendar events in the sidebar of the application. The main function, `resolvedCalendarEvent`, processes the calendar events based on the user's login status and the presence of events, returning appropriate messages when necessary.
 */

import { WarningCard } from "@/components/Sidebar/calendar/components/Card/WarningCard";
import type { Event } from "@microsoft/microsoft-graph-types";
import type { ReactNode } from "react";

/**
 * Resolves the calendar events to be displayed in the sidebar calendar component based on the user's login status and the presence of events.
 *
 * @param isLogged - A boolean indicating whether the user is logged in to their Microsoft account.
 * @param events - An array of calendar events, where each event is wrapped in an object with an `event` property.
 *
 * @returns An array of events to be displayed in the calendar, or a warning message if the user is not logged in or if there are no events for the selected date.
 */
export function resolvedCalendarEvent(
  isLogged: boolean,
  events: {
    event: Event;
  }[],
) {
  const toList = (children: ReactNode) => [{ children }];
  const noEventsFound = events?.length === 0 && isLogged;

  switch (true) {
    case !isLogged:
      return toList(
        <WarningCard
          message={
            "Connectez-vous à votre compte Microsoft pour afficher vos événements."
          }
        />,
      );
    case noEventsFound:
      return toList(
        <WarningCard
          message={"Vous n'avez aucun événement pour cette date."}
        />,
      );
    default:
      return events;
  }
}
