import VerticalFieldSelect from "@/components/Selects/VerticalFieldSelect";
import { timeSlotsFromSteps } from "@/components/Time/functions/time.functions";
import type { TimeFieldProps } from "@/components/Time/types/time-field.types";
import { Input } from "@/components/ui/input";
import { Item } from "@/components/ui/item";
import { Label } from "@/components/ui/label";
import { SelectItem } from "@/components/ui/select";
import { timeSteps } from "@/features/calendar/event-view/configs/event-view.configs";
import { cn } from "@/utils/utils";
import { useMemo, type ChangeEvent } from "react";

/**
 * TimeField component for selecting time values with an optional quick select dropdown.
 *
 * @param label - The label for the time field
 * @param step - The interval in seconds for the time slots (e.g., 900 for 15-minute intervals)
 * @param value - The current value of the time field in "HH:mm" format
 * @param onValueChange - Callback function to handle changes to the time value
 */
export function TimeField({
  label,
  value,
  step,
  onValueChange,
  ...props
}: TimeFieldProps) {
  const inputId = `${label.toLowerCase().replaceAll(" ", "-")}-time`;

  /**
   * Generate time slots based on the provided step interval using the timeSlotsFromSteps function.
   *
   * @description This is used to provide quick selection options in the dropdown for common time values based on the specified interval.
   *
   * @default 30 minutes (1800 seconds).
   */
  const timeSlotsMemo = useMemo(
    () => timeSlotsFromSteps(step ?? timeSteps),
    [step],
  );

  // Ticks the quick select value if the current value matches one of the generated time slots, otherwise it remains empty.
  const quickSelectValue = value && timeSlotsMemo.has(value) ? value : "";

  const onInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    event.stopPropagation();
    onValueChange?.(event.target.value || undefined);
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={inputId}>{label}</Label>
      <Item className="border-input justify-between bg-transparent p-0 pl-2 focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50">
        <Input
          id={inputId}
          type="time"
          title={label}
          aria-label={label}
          placeholder="HH:MM"
          value={value ?? ""}
          onChange={onInputChange}
          {...props}
          className={cn(
            "m-0 max-w-fit flex-1 border-0 bg-transparent p-0 text-base shadow-none outline-none",
            "rounded-none focus-visible:border-0 focus-visible:ring-0 md:text-sm selection:text-primary-foreground hover:cursor-text hover:selection:bg-transparent",
            props.className,
          )}
        />
        <VerticalFieldSelect
          fullWidth={false}
          value={quickSelectValue}
          triggerContent={null}
          triggerProps={{ className: "gap-0" }}
          onValueChange={onValueChange}
        >
          {Array.from(timeSlotsMemo).map((slot) => (
            <SelectItem key={slot} value={slot}>
              {slot}
            </SelectItem>
          ))}
        </VerticalFieldSelect>
      </Item>
    </div>
  );
}
