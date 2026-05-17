import withController from "@/components/HOCs/withController";
import { DateField } from "@/components/Popovers/Date/DateField";
import { TimeField } from "@/components/Time/TimeField";
import type { EventScheduleFieldsProps } from "@/features/calendar/event-view/components/types/event-schedule-field.types";
import { eventInputs } from "@/features/calendar/event-view/form/event-view.inputs";
import { useEffect } from "react";
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
  // Watch start and end to revalidate both when either changes
  const [start, end] = useWatch({
    control: form.control,
    name: [timeRange.start.name, timeRange.end.name],
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

    if (
      (start <= end && form.formState.errors.start?.type === "custom") ||
      form.formState.errors.end?.type === "custom"
    ) {
      form.trigger([timeRange.start.name, timeRange.end.name]);
    }
  }, [start, end, form, timeRange.end.name, timeRange.start.name]);

  return (
    <div className="space-y-4 rounded-lg border bg-muted/20 p-3">
      <div className="space-y-2">
        <ControlledDateField {...dateInput} control={form.control} />
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
