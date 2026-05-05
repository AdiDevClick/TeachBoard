import { getScoreColor } from "@/features/evaluations/main/components/score/functions/score.functions";
import type { ScoreDisplayProps } from "@/features/evaluations/main/components/score/types/score-display.types";

/**
 * Displays the score with a color corresponding to its value:
 * - Green for scores >= 14
 * - Yellow for scores >= 10 and < 14
 * - Red for scores < 10
 *
 * @param score - The score to display, expected to be between 0 and 20.
 */
export function ScoreDisplay({ score }: ScoreDisplayProps) {
  return (
    <span className={`tabular-nums font-semibold ${getScoreColor(score)}`}>
      {score.toFixed(1)}
      <span className="ml-0.5 text-xs font-normal text-muted-foreground">
        /20
      </span>
    </span>
  );
}
