/**
 * Determines the color class for a given score.
 *
 * @description Colors :
 * - Green for scores >= 14
 * - Yellow for scores >= 10 and < 14
 * - Red for scores < 10
 *
 * @param score - The score for which to determine the color, expected to be between 0 and 20.
 * @returns The color class corresponding to the score.
 */
export function getScoreColor(score: number) {
  if (score >= 14) return "text-green-600 dark:text-green-400";
  if (score >= 10) return "text-yellow-600 dark:text-yellow-400";
  return "text-red-600 dark:text-red-400";
}
