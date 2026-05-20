import { AppTestWrapper } from "@/tests/components/AppTestWrapper";
import { EventScheduleFields } from "@/features/calendar/event-view/components/EventScheduleFields";
import { eventInputs } from "@/features/calendar/event-view/form/event-view.inputs";
import type { EventViewFormSchema } from "@/features/calendar/event-view/models/event-view.models";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { expect, test } from "vitest";
import { userEvent } from "vitest/browser";
import { render } from "vitest-browser-react";

let currentForm: ReturnType<typeof useForm<EventViewFormSchema>> | null = null;

function EventScheduleFieldsHost() {
  const form = useForm<EventViewFormSchema>({
    defaultValues: {
      subject: "Planning",
      date: {
        single: "2026-05-20",
      },
      start: "09:00",
      end: "10:00",
      isAllDay: true,
      body: {
        content: "Agenda",
      },
    },
  });

  useEffect(() => {
    currentForm = form;
  }, [form]);

  return (
    <EventScheduleFields
      form={form}
      dateInput={eventInputs.date}
      timeRange={eventInputs.timeRange}
    />
  );
}

test("enables range mode even when all-day is active", async () => {
  await render(
    <AppTestWrapper>
      <EventScheduleFieldsHost />
    </AppTestWrapper>,
  );

  const rangeSwitch = document.querySelector<HTMLButtonElement>(
    'button[role="switch"]',
  );

  expect(rangeSwitch).not.toBeNull();
  if (!rangeSwitch) {
    throw new Error("Expected the range switch to render");
  }

  await expect.poll(() => currentForm?.getValues("isAllDay")).toBe(true);
  await expect
    .poll(() => rangeSwitch.getAttribute("aria-checked"))
    .toBe("false");

  await userEvent.click(rangeSwitch);

  await expect.poll(() => currentForm?.getValues("isAllDay")).toBe(false);
  await expect
    .poll(() => rangeSwitch.getAttribute("aria-checked"))
    .toBe("true");
});
