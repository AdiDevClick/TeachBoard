import {
  formatRangeCompat,
  getLocalCalendarViewRange,
} from "@/utils/dates/datetime";
import { describe, expect, it } from "vitest";

describe("formatRangeCompat", () => {
  it("returns undefined when the range is incomplete", () => {
    expect(formatRangeCompat()).toBe("");
    expect(formatRangeCompat("", "", false)).toBe("");
  });
});

describe("getLocalCalendarViewRange", () => {
  it("returns UTC instants for the selected local day boundaries", () => {
    const date = new Date(2026, 4, 12, 0, 0, 0, 0);
    const { start, end } = getLocalCalendarViewRange(date);
    const startInstant = new Date(start);
    const endInstant = new Date(end);

    expect(start).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/);
    expect(end).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/);
    expect(startInstant.getHours()).toBe(0);
    expect(startInstant.getDate()).toBe(12);
    expect(endInstant.getHours()).toBe(0);
    expect(endInstant.getDate()).toBe(13);
    expect(endInstant.getTime() - startInstant.getTime()).toBe(86_400_000);
  });

  it("returns the first day of the current month for month view", () => {
    const date = new Date(2026, 4, 12, 14, 30, 0, 0);
    const { start, end } = getLocalCalendarViewRange(date, "month");
    const startInstant = new Date(start);
    const endInstant = new Date(end);

    expect(startInstant.getFullYear()).toBe(2026);
    expect(startInstant.getMonth()).toBe(4);
    expect(startInstant.getDate()).toBe(1);
    expect(startInstant.getHours()).toBe(0);

    expect(endInstant.getFullYear()).toBe(2026);
    expect(endInstant.getMonth()).toBe(5);
    expect(endInstant.getDate()).toBe(1);
    expect(endInstant.getHours()).toBe(0);
  });

  it("returns the Monday of the current week for week view", () => {
    const date = new Date(2026, 4, 12, 14, 30, 0, 0);
    const { start, end } = getLocalCalendarViewRange(date, "week");
    const startInstant = new Date(start);
    const endInstant = new Date(end);

    expect(startInstant.getFullYear()).toBe(2026);
    expect(startInstant.getMonth()).toBe(4);
    expect(startInstant.getDate()).toBe(11);
    expect(startInstant.getDay()).toBe(1);
    expect(startInstant.getHours()).toBe(0);

    expect(endInstant.getFullYear()).toBe(2026);
    expect(endInstant.getMonth()).toBe(4);
    expect(endInstant.getDate()).toBe(18);
    expect(endInstant.getDay()).toBe(1);
    expect(endInstant.getHours()).toBe(0);
  });
});
