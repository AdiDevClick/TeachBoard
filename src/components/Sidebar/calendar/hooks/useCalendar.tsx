import { useAppStore } from "@/api/store/AppStore";
import { OFFSET_DATE_TIME_SCHEMA } from "@/api/types/openapi/common.types";
import { API_ENDPOINTS } from "@/configs/api.endpoints.config";
import { USER_ACTIVITIES } from "@/configs/app.config";
import { useCommandHandler } from "@/hooks/database/classes/useCommandHandler";
import { getLocalCalendarViewRange } from "@/utils/dates/datetime";
import type { Event } from "@microsoft/microsoft-graph-types";
import { useEffect, useEffectEvent, useMemo, useState } from "react";
export type CalendarFetchRange = "month" | "week" | "day";

export type UseCalendarOptions = {
  /**
   * The initial date to display in the calendar
   * @default new Date()
   */
  initialDate?: Date;
  fetchRange?: {
    start: Date;
    type: CalendarFetchRange;
  };
};

export function useCalendar(options: UseCalendarOptions = {}) {
  const isLoggedToMicrosoft = useAppStore(
    (state) => state.socialsLoggedIn.microsoft,
  );
  const { setFetchParams, resultsCallback } = useCommandHandler({
    form: null!,
    pageId: "none",
  });

  const [date, setDate] = useState<Date>(options.initialDate || new Date());

  /**
   * Wraps each event into an event object
   *
   * @description To ensure an easy props handling in the `CalendarEvent`
   */
  const events = useMemo(() => {
    const calendarEventList: Event[] = resultsCallback() ?? [];

    return calendarEventList.map((event) => ({ event }));
  }, [resultsCallback]);

  /**
   * Fetch trigger
   *
   * @description Creates the endpoint and fetches the calendar events
   */
  const dateChangeTrigger = useEffectEvent((date: Date) => {
    const { start, end } = getLocalCalendarViewRange(
      date,
      options.fetchRange?.type,
    );

    const eventsUri =
      API_ENDPOINTS.GET.CALENDAR_EVENTS.endPoints.EVENTS_RANGES_STARTS(
        OFFSET_DATE_TIME_SCHEMA.parse(start),
        OFFSET_DATE_TIME_SCHEMA.parse(end),
      );

    setFetchParams((prev) => ({
      ...prev,
      contentId: USER_ACTIVITIES.calendar,
      method: API_ENDPOINTS.GET.METHOD,
      url: API_ENDPOINTS.GET.CALENDAR_EVENTS.endPoints.PROXY_ENDPOINT,
      dataReshapeFn: API_ENDPOINTS.GET.CALENDAR_EVENTS.dataReshape,
      cachedFetchKey: [USER_ACTIVITIES.calendar, eventsUri],
      headers: new Headers({
        "x-target-url": eventsUri,
      }),
    }));
  });

  /**
   * Fetch new Calendar Events
   *
   * @description Each time the user clicks on a calendar's date
   */
  useEffect(() => {
    if (!isLoggedToMicrosoft) return;
    dateChangeTrigger(date);
  }, [date, isLoggedToMicrosoft]);

  return {
    date,
    events,
    setDate,
  };
}
