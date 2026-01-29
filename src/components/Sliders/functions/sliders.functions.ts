/**
 * Get color based on value range.
 *
 * @param value - The numeric value to evaluate.
 * @returns The corresponding color as a string.
 */
export function sliderRangeColor(value: number) {
  const red = "#e53935";
  const yellow = "#f9a825";
  const lightGreen = "#7cb342";
  const green = "#2e7d32";
  const white = "#ffffff";

  if (value === 25) return red;
  if (value === 50) return yellow;
  if (value === 75) return lightGreen;
  if (value === 100) return green;

  return white;
}
