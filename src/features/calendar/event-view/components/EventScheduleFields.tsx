import withController from "@/components/HOCs/withController";
import { withInlineItemAndSwitchSelection } from "@/components/HOCs/withInlineItemAndSwitchSelection";
import { DateField } from "@/components/Popovers/Date/DateField";
import type { DateFieldProps } from "@/components/Popovers/Date/types/date-field.types";
import { TimeField } from "@/components/Time/TimeField";
import { Item } from "@/components/ui/item";
import type { EventScheduleFieldsProps } from "@/features/calendar/event-view/components/types/event-schedule-field.types";
import { eventInputs } from "@/features/calendar/event-view/form/event-view.inputs";
import { useEffect, useMemo, useState } from "react";
import { useWatch } from "react-hook-form";

/**
 * Component for rendering the schedule fields of an event, including date and time inputs.
 *
 * @description This will create a section displaying :
 * - A date field button thatpops up a date picker, which can be configured for single or multi-date selection.
 * - A pair of time fields inputs for selecting the start and end times of the event
 *
 * @remark The components are validated using RHF Controller
 * Provide the form using `useForm`
 *
 * @param form - The react-hook-form instance for managing form state and validation.
 * @param timeRange - The configuration for the start and end time fields, with default values from eventInputs.
 * @param dateInput - The configuration for the date field, with a default value from eventInputs.
 */
export function EventScheduleFields({
  form,
  timeRange = eventInputs.timeRange,
  dateInput = eventInputs.date,
}: EventScheduleFieldsProps) {
  const [isRanged, setIsRanged] = useState(dateInput.mode === "range");

  const inputNamesMemo = useMemo(
    () => [timeRange.start.name, timeRange.end.name],
    [timeRange],
  );

  // Watch start and end to revalidate both when either changes
  const [start, end] = useWatch({
    control: form.control,
    name: inputNamesMemo,
  });

  /**
   * Effect to validate the time range whenever start or end changes. If either start or end is missing, it will not trigger validation.
   * 
   * @description Each time an error of type "custom" is present for either start or end and the errors are solved (i.e., start and end are in a valid range)

    * @remark It will trigger validation for both fields to clear the errors.
   */
  useEffect(() => {
    if (!start || !end) {
      return;
    }

    const errors = form.formState.errors;

    if (
      (start <= end && errors.start?.type === "custom") ||
      errors.end?.type === "custom"
    ) {
      form.trigger(inputNamesMemo);
    }
  }, [start, end, form, inputNamesMemo]);

  const enrichedDateInput = {
    ...dateInput,
    mode: isRanged ? "range" : ("single" as DateFieldProps["mode"]),
    className: "w-full",
  };

  return (
    <Item className="space-y-4">
      <div className="relative w-full">
        <ControlledDateField {...enrichedDateInput} control={form.control} />
        <InlineSwitch
          id="event-date-range-switch"
          className="absolute grid-cols-2! -top-1! inset-0 w-fit items-start place-items-end justify-self-end mb-5"
          title="Range"
          isSelected={isRanged}
          onSwitchClick={() => setIsRanged(!isRanged)}
        />
      </div>
      <ControlledTimeField {...timeRange.start} control={form.control} />
      <ControlledTimeField {...timeRange.end} control={form.control} />
    </Item>
  );
}

const ControlledDateField = withController(DateField);
const ControlledTimeField = withController(TimeField);
const InlineSwitch = withInlineItemAndSwitchSelection(() => null);
