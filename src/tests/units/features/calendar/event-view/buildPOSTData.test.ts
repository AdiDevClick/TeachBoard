import { buildPOSTData } from "@/features/calendar/event-view/controllers/functions/event-view.controller.functions";
import { describe, expect, it } from "vitest";

describe("buildPOSTData", () => {
  it("normalizes a midnight schedule to an all-day payload", () => {
    const payload = buildPOSTData({
      subject: "Planning",
      isAllDay: false,
      date: {
        single: "2026-05-20",
      },
      start: "00:00",
      end: "00:00",
      body: {
        content: "Agenda",
      },
    });

    expect(payload.isAllDay).toBe(true);
    expect(payload.start).toEqual({
      dateTime: "2026-05-20T00:00:00",
      timeZone: "UTC",
    });
    expect(payload.end).toEqual({
      dateTime: "2026-05-21T00:00:00",
      timeZone: "UTC",
    });
  });

  it("keeps a normal timed event as a non all-day payload", () => {
    const payload = buildPOSTData({
      subject: "Meeting",
      isAllDay: false,
      date: {
        single: "2026-05-20",
      },
      start: "09:00",
      end: "10:30",
    });

    expect(payload.isAllDay).toBe(false);
    expect(payload.start).toEqual({
      dateTime: "2026-05-20T09:00:00",
      timeZone: "UTC",
    });
    expect(payload.end).toEqual({
      dateTime: "2026-05-20T10:30:00",
      timeZone: "UTC",
    });
  });
});
