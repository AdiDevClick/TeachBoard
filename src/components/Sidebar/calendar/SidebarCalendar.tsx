import { useAppStore } from "@/api/store/AppStore";
import { CalendarEventsList } from "@/components/Sidebar/calendar/Event/exports/calendar-event.exports";
import type { CalendarEventProps } from "@/components/Sidebar/calendar/Event/types/calendar-events.types";
import { resolvedCalendarEvent } from "@/components/Sidebar/calendar/functions/sidebar-calendar.functions";
import { useCalendar } from "@/components/Sidebar/calendar/hooks/useCalendar";
import type { SidebarCalendarProps } from "@/components/Sidebar/calendar/types/sidebar-calendar.types";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { SidebarGroup } from "@/components/ui/sidebar.tsx";
import { debugLogs } from "@/configs/app-components.config";
import { useDialog } from "@/hooks/contexts/useDialog";
import { formatDate } from "@/utils/dates/datetime";
import { preventDefaultAndStopPropagation } from "@/utils/utils";
import "@css/Calendar.scss";
import { fr } from "date-fns/locale";
import { PlusIcon } from "lucide-react";

const today = new Date();

/**
 * Sidebar Menu Calendar Component
 *
 * @param props - Additional props for the SidebarGroup (e.g., className)
 */
export default function SidebarCalendar({
  className,
  ...props
}: SidebarCalendarProps) {
  const isLoggedToMicrosoft = useAppStore(
    (state) => state.socialsLoggedIn.microsoft,
  );

  const { openDialog } = useDialog();
  const { events, date, setDate } = useCalendar({
    initialDate: today,
    fetchRange: {
      start: today,
      type: "day",
    },
  });

  /**
   * Handles the click event on a calendar event
   *
   * @remark This will open the event details drawer when a calendar event is clicked and pass the event data to the dialog context.
   *
   * @param e - The mouse event triggered by the click on the calendar event.
   * @param event - The calendar event data associated with the clicked event.
   */
  const onEventClickHandler = (
    ...args: Parameters<NonNullable<CalendarEventProps["onClick"]>>
  ) => {
    const [e, event] = args;

    preventDefaultAndStopPropagation(e);
    debugLogs("SidebarCalendar:onEventClickHandler", {
      type: "componentHandler",
      message: `Clicked on event: ${event?.subject}`,
      event,
    });

    // open the event details
    openDialog(null, "event-view", { event });
  };

  const resolvedEvents = resolvedCalendarEvent(isLoggedToMicrosoft, events);

  return (
    <SidebarGroup className={"sidebar-calendar-container"}>
      <Card className={className} {...props}>
        <CardContent className="card-container__content">
          <Calendar
            mode="single"
            captionLayout="dropdown"
            selected={date}
            onSelect={setDate}
            locale={fr}
            className="calendar"
            required
          />
        </CardContent>
        <CardFooter className="flex flex-col items-start gap-3 border-t px-4 pt-4!">
          <div className="flex w-full items-center justify-between px-1">
            <div className="text-sm font-medium">{formatDate(date)}</div>
            <Button variant="ghost" size="icon" title="Add Event">
              <PlusIcon />
              <p className="sr-only">Add Event</p>
            </Button>
          </div>
          <div className="flex w-full flex-col gap-2">
            <CalendarEventsList
              items={resolvedEvents}
              onClick={onEventClickHandler}
            />
          </div>
        </CardFooter>
      </Card>
    </SidebarGroup>
  );
}
