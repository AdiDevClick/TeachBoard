/**
 * Uses the step from an input to generate time slots for quick selection in the TimeField component.
 *
 * @param step - The interval in seconds for the time slots (e.g., 900 for 15-minute intervals)
 *
 * @returns An array of time slots in "HH:mm" format based on the provided step interval.
 */
export const timeSlotsFromSteps = (step?: number) => {
  // Default to 30 minutes if no step is provided
  const interval = step ?? 60 * 30;
  const minutes = interval / 60;

  // Calculate how many slots fit in a day based on the interval
  const slotsPerDay = (24 * 60 * 60) / interval;

  // transform each calculated interval into a time string in the format "HH:mm"
  return new Set(
    Array.from({ length: slotsPerDay }, (_, index) => {
      const hour = String(Math.floor(index / (60 / minutes))).padStart(2, "0");
      const minute = String((index % (60 / minutes)) * minutes).padStart(
        2,
        "0",
      );

      return `${hour}:${minute}`;
    }),
  );
};
