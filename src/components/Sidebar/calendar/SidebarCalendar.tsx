import { SidebarDataContext } from "@/api/contexts/SidebarDataContext.ts";
import { ListMapper } from "@/components/Lists/ListMapper.tsx";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { SidebarGroup } from "@/components/ui/sidebar.tsx";
import { formatDate, formatRangeCompat } from "@/lib/utils.ts";
import "@css/Calendar.scss";
import { fr } from "date-fns/locale";
import { PlusIcon } from "lucide-react";
import { use, useState } from "react";

/**
 * Sidebar Menu Calendar Component
 *
 * @param props - Additional props for the SidebarGroup (e.g., className)
 */
export default function SidebarCalendar({ ...props }) {
  const events = use(SidebarDataContext);
  const [date, setDate] = useState<Date>(new Date(2025, 5, 12));

  if (!events) return null;

  const calendarEvents = events.calendarEvents || [];

  return (
    <SidebarGroup className={"sidebar-calendar-container"}>
      <Card className={props.className} {...props}>
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
        <CardFooter className="flex flex-col items-start gap-3 border-t px-4 !pt-4">
          <div className="flex w-full items-center justify-between px-1">
            <div className="text-sm font-medium">{formatDate(date)}</div>
            <Button
              variant="ghost"
              size="icon"
              className="size-6"
              title="Add Event"
            >
              <PlusIcon />
              <span className="sr-only">Add Event</span>
            </Button>
          </div>
          <div className="flex w-full flex-col gap-2">
            <ListMapper items={calendarEvents}>
              {(event) => (
                <div
                  key={event.title}
                  className="bg-muted after:bg-primary/70 relative rounded-md p-2 pl-6 text-sm after:absolute after:inset-y-2 after:left-2 after:w-1 after:rounded-full"
                >
                  <div className="font-medium">{event.title}</div>
                  <div className="text-muted-foreground text-xs">
                    {formatRangeCompat(
                      new Date(event.from),
                      new Date(event.to)
                    )}
                  </div>
                </div>
              )}
            </ListMapper>
          </div>
        </CardFooter>
      </Card>
    </SidebarGroup>
  );
}
