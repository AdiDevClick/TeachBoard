import { FormWithDebug } from "@/components/Form/FormWithDebug";
import { ControlledLabelledInput } from "@/components/Inputs/exports/labelled-input.exports";
import { ControlledLabelledTextArea } from "@/components/TextAreas/exports/labelled-textarea";
import { EventScheduleFields } from "@/features/calendar/event-view/components/EventScheduleFields";
import type { EventViewFormSchema } from "@/features/calendar/event-view/models/event-view.models";
import type { EventViewProps } from "@/features/calendar/event-view/types/event-view.types";
import { useDialog } from "@/hooks/contexts/useDialog";
import type { AppControllerInterface } from "@/types/AppControllerInterface";
import { formatRangeCompat } from "@/utils/dates/datetime";
import type { Event } from "@microsoft/microsoft-graph-types";

export type EventViewControllerProps = Readonly<
  AppControllerInterface<EventViewFormSchema> & {
    inputControllers: Exclude<EventViewProps["inputControllers"], undefined>;
  }
>;

function omitTask<T extends { task?: unknown }>(value: T): Omit<T, "task"> {
  const rest = { ...value };

  delete rest.task;

  return rest;
}

export function EventViewController({
  form,
  inputControllers,
  pageId,
  formId,
}: EventViewControllerProps) {
  const event = useDialog().dialogOptions(pageId)?.event as Event;
  const { start, end, isAllDay } = event ?? {};
  const subject = omitTask(inputControllers.subject);
  const bodyContent = omitTask(inputControllers.bodyContent);

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

  function handleValidSubmit() {
    const values = form.getValues();

    const payload: Record<string, unknown> = {
      subject: values.subject,
      body: values.body ? { content: values.body.content } : undefined,
      start: values.start ? { dateTime: values.start } : undefined,
      end: values.end ? { dateTime: values.end } : undefined,
      isAllDay: values.isAllDay ?? false,
    };

    // Exemple : prêt à être envoyé au serveur. Adapter selon l'API.
    // Remarque : `values.start` et `values.end` sont des ISO strings (yyyy-MM-ddTHH:mm)
    // si les champs de date/heure ont été composés par `EventScheduleFields`.
    // Ici on les logue pour vérification avant envoi réel.
    // Exemple: appeler la fonction API d'envoi ici (ex. api.createEvent(payload)).
    console.log("Prepared event payload:", payload);
    return payload;
  }

  return (
    <FormWithDebug
      form={form}
      formId={formId}
      pageId={pageId}
      onValidSubmit={handleValidSubmit}
      onInvalidSubmit={() => undefined}
    >
      <ControlledLabelledInput {...subject} {...sharedProps} />
      <EventScheduleFields
        {...sharedProps}
        form={form}
        timeRange={inputControllers.timeRange}
        dateInput={inputControllers.date}
      />
      <ControlledLabelledTextArea {...bodyContent} {...sharedProps} />
      <p>{range}</p>
    </FormWithDebug>
  );
}
