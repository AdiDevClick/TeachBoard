import type { CalendarEventProps } from "@/components/Sidebar/calendar/Event/types/calendar-events.types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  formatRangeCompat,
  getDurationFromRange,
} from "@/utils/dates/datetime";
import sanitizeDOMProps from "@/utils/props";
import { preventDefaultAndStopPropagation } from "@/utils/utils";
import {
  calendarEvents,
  calendarEventsTime,
  calendarEventsTitle,
} from "@css/CalendarEvents.module.scss";
import type { MouseEvent } from "react";

/**
 * Display a single calendar event
 *
 * @description Includes a title, a time range, and a duration badge.
 *
 * @remark If you pass a children prop, it will be rendered instead of the default event content.
 * Use this to customize the event display (e.g., for loading states or error messages). In this case, the `event` prop will be ignored.
 *
 * @remark2 The time range is formatted based on whether the event is all-day or not.
 *
 * @param event - All properties for the calendar event
 * @param ...props - All the button properties
 */
export function CalendarEvent({
  children,
  event = {},
  ...buttonRest
}: CalendarEventProps) {
  if (children) {
    return children;
  }

  const { subject, start, end, isAllDay = false } = event;

  const safeButtonProps = sanitizeDOMProps(buttonRest, ["index"]);

  const range = formatRangeCompat(start?.dateTime, end?.dateTime, isAllDay!);
  const duration = getDurationFromRange(
    start?.dateTime,
    end?.dateTime,
    isAllDay!,
  );

  /**
   * Enrich the click event with the calendar event data and pass it to the parent onClick handler
   */
  const onClickHandler = (e: MouseEvent<HTMLButtonElement>) => {
    preventDefaultAndStopPropagation(e);
    safeButtonProps.onClick?.(e, event);
  };

  return (
    <Button
      variant={"secondary"}
      className={calendarEvents}
      {...safeButtonProps}
      onClick={onClickHandler}
      type="button"
    >
      <div className={calendarEventsTitle}>{subject}</div>
      <div className={calendarEventsTime}>
        <p>{range}</p>
        <Badge variant="outline">{duration}</Badge>
      </div>
    </Button>
  );
}
