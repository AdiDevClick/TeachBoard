import type { EvaluationResultsPreviewProps } from "@/features/evaluations/preview-view/components/results-preview/types/evaluation-preview.types";
import { ScoreDisplay } from "@/features/evaluations/main/components/score/ScoreDisplay";

/**
 * Component to display a preview of an evaluation result for a single student, including their name, assigned task, overall score, and presence status.
 *
 * @param name - The name of the student.
 * @param assignedTask - The task assigned to the student, containing its name.
 * @param overallScore - The overall score of the student for the evaluation, expected to be a number between 0 and 5. If null, it indicates that the score is not available.
 * @param isPresent - A boolean indicating whether the student was present for the evaluation.
 */
export function EvaluationResultsPreview({
  name,
  assignedTask,
  overallScore,
  isPresent,
}: EvaluationResultsPreviewProps) {
  return (
    <li className="flex items-center justify-between rounded-md p-1.5 even:bg-muted/40">
      <div className="grid items-center gap-2">
        <p>{name}</p>
        <p className="text-xs text-muted-foreground">— {assignedTask.name}</p>
      </div>
      {isPresent && overallScore !== null ? (
        <ScoreDisplay score={overallScore / 5} />
      ) : (
        <span className="text-xs text-muted-foreground">—</span>
      )}
    </li>
  );
}
