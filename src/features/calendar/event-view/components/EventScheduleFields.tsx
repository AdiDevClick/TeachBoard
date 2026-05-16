import withController from "@/components/HOCs/withController";
import { ControlledPopoverField } from "@/components/Popovers/exports/popover-field.exports";
import PopoverField from "@/components/Popovers/PopoverField";
import { VerticalFieldSelect } from "@/components/Selects/VerticalFieldSelect";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Item } from "@/components/ui/item";
import { Label } from "@/components/ui/label";
import { SelectItem } from "@/components/ui/select";
import { eventInputs } from "@/features/calendar/event-view/form/event-view.inputs";
import type { EventViewFormSchema } from "@/features/calendar/event-view/models/event-view.models";
import { usePopoverFieldContextSafe } from "@/hooks/contexts/usePopover.ts";
import { cn } from "@/utils/utils";
import { Temporal } from "@js-temporal/polyfill";
import { useState, type ChangeEvent, type ComponentProps } from "react";
import type { DateRange } from "react-day-picker";
import { type UseFormReturn } from "react-hook-form";
import {
  composeDateTime,
  formatDate,
  fromLocalDate,
} from "../../../../utils/dates/datetime";

type CalendarMode = ComponentProps<typeof Calendar>["mode"];

const halfHourSlots = Array.from({ length: 48 }, (_, index) => {
  const hour = String(Math.floor(index / 2)).padStart(2, "0");
  const minute = index % 2 === 0 ? "00" : "30";

  return `${hour}:${minute}`;
});

// utilities imported from ../utils/datetime

type TimeFieldProps = Readonly<
  {
    label: string;
    step?: number;
    value?: string;
    onValueChange?: (value?: string) => void;
  } & ComponentProps<typeof Input>
>;

function TimeField({
  label,
  step,
  value,
  onValueChange,
  ...props
}: TimeFieldProps) {
  const inputId = `${label.toLowerCase().replaceAll(" ", "-")}-time`;
  const quickSelectValue = value && halfHourSlots.includes(value) ? value : "";

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
          step={step}
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
          {halfHourSlots.map((slot) => (
            <SelectItem key={slot} value={slot}>
              {slot}
            </SelectItem>
          ))}
        </VerticalFieldSelect>
      </Item>
    </div>
  );
}

type TimeRangeInput = Readonly<{
  name: string;
  label: string;
  step?: number;
}>;

type TimeRangeFields = Readonly<{
  start: TimeRangeInput;
  end: TimeRangeInput;
}>;

type EventScheduleFieldsProps = Readonly<{
  start?: string;
  end?: string;
  timeRange?: TimeRangeFields;
  onDateChange?: (date: Temporal.PlainDate) => void;
  onStartTimeChange?: (value?: string) => void;
  onEndTimeChange?: (value?: string) => void;
}>;

type ControlledEventScheduleFieldsProps = Readonly<{
  form: UseFormReturn<EventViewFormSchema>;
  timeRange?: EventScheduleFieldsProps["timeRange"];
  dateInput?: typeof eventInputs.date;
}>;

type DateFieldProps = Readonly<
  {
    formApi?: UseFormReturn<EventViewFormSchema>;
    value?: EventViewFormSchema["date"];
    endValue?: string;
    onValueChange?: (value?: EventViewFormSchema["date"]) => void;
    onEndValueChange?: (value?: string) => void;
    onSelect?: (date: Date | DateRange | undefined) => void;
    mode?: CalendarMode;
    control?: UseFormReturn<EventViewFormSchema>["control"];
  } & Omit<ComponentProps<typeof PopoverField>, "triggerContent">
>;

type DateFieldState = {
  single?: Date;
  range?: DateRange;
};

type DateSelection = Date | DateRange;

function isDateRangeSelection(value: DateSelection): value is DateRange {
  return !(value instanceof Date);
}

function serializeDateFieldValue(
  selection: DateSelection | undefined,
  mode: CalendarMode,
): EventViewFormSchema["date"] | undefined {
  if (!selection) {
    return undefined;
  }

  if (mode === "range") {
    return serializeRangeDateFieldValue(selection);
  }

  if (!(selection instanceof Date)) {
    return undefined;
  }

  const single = composeDateTime(fromLocalDate(selection), "00:00");

  return single ? { single, range: undefined } : undefined;
}

function serializeRangeDateFieldValue(selection: Date | DateRange) {
  const fromDate = selection instanceof Date ? selection : selection.from;
  const toDate = selection instanceof Date ? undefined : selection.to;

  const from = fromDate
    ? composeDateTime(fromLocalDate(fromDate), "00:00")
    : undefined;
  const to = toDate
    ? composeDateTime(fromLocalDate(toDate), "00:00")
    : undefined;
  const single = from ?? to;

  if (!single) {
    return undefined;
  }

  return {
    single,
    range: from && to ? { from, to } : undefined,
  };
}

function DateField({
  onSelect,
  onValueChange,
  mode = "single",
  ...props
}: DateFieldProps) {
  const [date, setDate] = useState<DateFieldState>({
    range: undefined,
    single: undefined,
  });
  const onCalendarSelect = (date: Date | DateRange | undefined) => {
    if (!date) return;

    setDate((prev) => {
      if (isDateRangeSelection(date)) {
        return { ...prev, range: date };
      }

      if (date instanceof Date) {
        return { ...prev, single: date };
      }

      return prev;
    });

    onValueChange?.(serializeDateFieldValue(date, mode));
    onSelect?.(date);
  };

  return (
    <ControlledPopoverField
      {...props}
      control={props.formApi?.control}
      name={props.name ?? "event-date"}
    >
      <CalendarWithClose
        mode={mode}
        selected={mode === "range" ? date.range : date.single}
        onSelect={onCalendarSelect}
        className="w-full"
        captionLayout="dropdown"
        required
      />
    </ControlledPopoverField>
  );
}
function selectString(mode: CalendarMode, date?: DateFieldState) {
  if (mode === "range" && date?.range) {
    if (!date.range.from) {
      return "Sélectionnez une date de début";
    }
    if (!date.range.to) {
      return "Sélectionnez une date de fin";
    }

    const from = formatDate(date.range.from);
    const to = formatDate(date.range.to);
    return `${from} - ${to}`;
  } else if (mode === "single" && date?.single) {
    return formatDate(date.single);
  } else {
    return "Sélectionnez une date";
  }
}

type CalendarWithCloseProps = {
  mode: CalendarMode;
  selected?: Date | DateRange;
  onSelect?: (d: Date | DateRange | undefined) => void;
} & { required: true } & Omit<
    ComponentProps<typeof Calendar>,
    "mode" | "selected" | "onSelect"
  >;

type AnyCalendarProps = Omit<ComponentProps<typeof Calendar>, "onSelect"> & {
  onSelect?: unknown;
};

function CalendarWithClose(props: CalendarWithCloseProps) {
  const ctx = usePopoverFieldContextSafe();

  const handleSelect = (date?: Date | DateRange) => {
    props.onSelect?.(date);

    // Notify PopoverField context so the Popover's store/display updates
    if (date) {
      const displayString = selectString(
        props.mode,
        props.mode === "range" && !(date instanceof Date)
          ? { range: date }
          : { single: date instanceof Date ? date : undefined },
      );
      ctx?.onSelect?.(displayString);
    }

    if (props.mode !== "range") {
      ctx?.close?.();
    }
  };

  // @ts-expect-error - intentionally widen the handler to match multiple DayPicker overloads
  return (
    <Calendar
      {...(props as unknown as AnyCalendarProps)}
      onSelect={handleSelect}
    />
  );
}

export function EventScheduleFields({
  form,
  timeRange = eventInputs.timeRange,
  dateInput = eventInputs.date,
}: ControlledEventScheduleFieldsProps) {
  return (
    <div className="space-y-4 rounded-lg border bg-muted/20 p-3">
      <div className="space-y-2">
        <ControlledDateField
          {...dateInput}
          control={form.control}
          formApi={form}
        />
      </div>
      <div className="grid gap-3 lg:grid-cols-2">
        <ControlledTimeField {...timeRange.start} control={form.control} />
        <ControlledTimeField {...timeRange.end} control={form.control} />
      </div>
    </div>
  );
}

const ControlledDateField = withController(DateField);
const ControlledTimeField = withController(TimeField);
