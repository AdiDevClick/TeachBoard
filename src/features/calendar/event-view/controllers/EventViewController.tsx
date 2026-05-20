import { FormWithDebug } from "@/components/Form/FormWithDebug";
import withController from "@/components/HOCs/withController";
import { withInlineItemAndSwitchSelection } from "@/components/HOCs/withInlineItemAndSwitchSelection";
import { ControlledLabelledInput } from "@/components/Inputs/exports/labelled-input.exports";
import { useCalendar } from "@/components/Sidebar/calendar/hooks/useCalendar";
import { ControlledLabelledTextArea } from "@/components/TextAreas/exports/labelled-textarea";
import { Item, ItemGroup } from "@/components/ui/item";
import { API_ENDPOINTS } from "@/configs/api.endpoints.config";
import { HTTP_METHODS } from "@/configs/app.config";
import { EventScheduleFields } from "@/features/calendar/event-view/components/EventScheduleFields";
import { buildPOSTData } from "@/features/calendar/event-view/controllers/functions/event-view.controller.functions";
import type { EventViewControllerProps } from "@/features/calendar/event-view/controllers/types/event-view.controller.types";
import type { EventViewFormSchema } from "@/features/calendar/event-view/models/event-view.models";

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
  event,
  submitRoute,
  submitDataReshapeFn,
}: EventViewControllerProps) {
  const { id } = event ?? {};
  const { submitCallback } = useCalendar({
    pageId,
    submitRoute,
    submitDataReshapeFn,
  });

  const sharedProps = {
    control: form.control,
  };

  /**
   * Handles the submission of the event form.
   *
   * @description This function is called when the form is submitted with valid data. It reshapes the form data into the format expected by the API and triggers the submit callback with the appropriate HTTP method (POST for creating a new event, PATCH for updating an existing event).
   *
   * @param variables - The form data submitted by the user, which includes the event details such as subject, date, time, and body content.
   */
  function onSubmit(variables: EventViewFormSchema) {
    const data = buildPOSTData(variables);
    submitCallback(data, {
      method: HTTP_METHODS.PATCH,
      headers: new Headers({
        "x-target-url": `${API_ENDPOINTS.POST.CALENDAR_EVENT.endpoints.MAIN}/${id}`,
      }),
    });
  }

  return (
    <FormWithDebug
      form={form}
      formId={formId}
      pageId={pageId}
      onValidSubmit={onSubmit}
      onInvalidSubmit={() => undefined}
    >
      <ItemGroup>
        <Item>
          <ControlledLabelledInput
            {...inputControllers.subject}
            {...sharedProps}
          />
        </Item>
        <Item>
          <ControlledSwitch
            {...sharedProps}
            {...inputControllers.isAllDay}
            className="grid-cols-2! w-fit!"
          />
        </Item>
        <EventScheduleFields
          {...sharedProps}
          form={form}
          timeRange={inputControllers.timeRange}
          dateInput={inputControllers.date}
        />
        <Item>
          <ControlledLabelledTextArea
            {...inputControllers.bodyContent}
            {...sharedProps}
          />
        </Item>
      </ItemGroup>
    </FormWithDebug>
  );
}

const ControlledSwitch = withController(
  withInlineItemAndSwitchSelection(() => null),
);
