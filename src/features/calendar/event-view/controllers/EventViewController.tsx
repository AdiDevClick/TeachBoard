import { FormWithDebug } from "@/components/Form/FormWithDebug";
import { withInlineItemAndSwitchSelection } from "@/components/HOCs/withInlineItemAndSwitchSelection";
import { ControlledLabelledInput } from "@/components/Inputs/exports/labelled-input.exports";
import { ControlledLabelledTextArea } from "@/components/TextAreas/exports/labelled-textarea";
import { EventScheduleFields } from "@/features/calendar/event-view/components/EventScheduleFields";
import type { EventViewControllerProps } from "@/features/calendar/event-view/controllers/types/event-view.controller.types";
import { useDialog } from "@/hooks/contexts/useDialog";
import { formatRangeCompat } from "@/utils/dates/datetime";
import type { Event } from "@microsoft/microsoft-graph-types";
import { useState } from "react";

/**
 * Controller for the EventView component, which displays the details of a calendar event in a vertical drawer.
 *
 * @description Manages the state and logic for the EventView component, including form handling and event data retrieval.
 *
 * @param form - The react-hook-form instance for managing the event form state and validation.
 * @param inputControllers - The configuration for the form inputs, including their names and labels.
 * @param pageId - The ID of the page, used to retrieve the event data from the dialog options.
 * @param formId - The ID of the form, used for debugging purposes in the FormWithDebug component.
 */
export function EventViewController({
  form,
  inputControllers,
  pageId,
  formId,
}: EventViewControllerProps) {
  const [isRanged, setIsRanged] = useState(false);
  const event = useDialog().dialogOptions(pageId)?.event as Event;
  const { start, end, isAllDay } = event ?? {};

  let range = "No date information available";

  if (isAllDay) {
    range = "Toute la journée";
  } else {
    range =
      formatRangeCompat(start?.dateTime, end?.dateTime, Boolean(isAllDay)) ??
      range;
  }

  const sharedProps = {
    control: form.control,
  };

  /**
   * Handles the submission of the event form.
   * @TODO
   */
  function handleValidSubmit() {
    const values = form.getValues();

    return {
      subject: values.subject,
      body: values.body ? { content: values.body.content } : undefined,
      start: values.start ? { dateTime: values.start } : undefined,
      end: values.end ? { dateTime: values.end } : undefined,
      isAllDay: values.isAllDay ?? false,
    };
  }

  return (
    <FormWithDebug
      form={form}
      formId={formId}
      pageId={pageId}
      onValidSubmit={handleValidSubmit}
      onInvalidSubmit={() => undefined}
    >
      <ControlledLabelledInput {...inputControllers.subject} {...sharedProps} />
      <InlineSwitch
        title="Range"
        isSelected={isRanged}
        onSwitchClick={() => setIsRanged(!isRanged)}
      />
      <EventScheduleFields
        {...sharedProps}
        form={form}
        timeRange={inputControllers.timeRange}
        dateInput={{
          ...inputControllers.date,
          mode: isRanged ? "range" : "single",
        }}
      />
      <ControlledLabelledTextArea
        {...inputControllers.bodyContent}
        {...sharedProps}
      />
      <p>{range}</p>
    </FormWithDebug>
  );
}

const InlineSwitch = withInlineItemAndSwitchSelection(() => null);
