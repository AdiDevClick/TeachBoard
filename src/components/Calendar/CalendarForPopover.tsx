import { formatSelectString } from "@/components/Calendar/functions/calendar.functions";
import type {
  CalendarForPopoverProps,
  DateSelection,
} from "@/components/Calendar/types/calendar.types";
import { Calendar } from "@/components/ui/calendar";
import { usePopoverFieldContextSafe } from "@/hooks/contexts/usePopover";
import type { OnSelectHandler } from "react-day-picker";

/**
 * Enhance the Calendar component to work seamlessly within a PopoverField context by automatically updating the Popover's display string based on the selected date(s).
 *
 * @description This also can close the popover automatically when a single mode is used.
 * If you use the range mode, you will need to use the `multiSelection` from the `Popover` and the `useFieldStore` hook to get the values and update the display string accordingly. @see `DateField` for an example of this.
 */
export function CalendarForPopover(props: CalendarForPopoverProps) {
  const ctx = usePopoverFieldContextSafe();

  const handleSelect = (
    ...args: Parameters<OnSelectHandler<DateSelection>>
  ) => {
    props.onSelect?.(...args);

    // Update Popover display
    if (args[0]) {
      const displayString = formatSelectString(args[0]);
      if (displayString) ctx?.onSelect?.(displayString);
    }
  };

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore: forward props to Calendar/DayPicker (acceptable runtime shape)
  return <Calendar {...props} onSelect={handleSelect} />;
}
