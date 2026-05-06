/**
 * Clamps a score value between 0 and 100.
 *
 * @description Makes sure a score cannot be set below 0 or above 100.
 *
 * @param value - The score value to clamp.
 *
 * @returns The clamped score value,
 */
export const clampScore = (value: number) => {
  if (value > 100) {
    return 100;
  }

  if (value < 0 || Number.isNaN(value)) {
    return 0;
  }

  return value;
};
