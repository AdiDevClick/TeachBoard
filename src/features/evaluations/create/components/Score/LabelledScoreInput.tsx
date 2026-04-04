import { ControlledLabelledInput } from "@/components/Inputs/exports/labelled-input.exports";
import { LabelledScore } from "@/features/evaluations/create/components/Score/LabelledScore";
import type { LabelledScoreInputProps } from "@/features/evaluations/create/components/Score/types/score-types";
import { useEvaluationStepsCreationStore } from "@/features/evaluations/create/store/EvaluationStepsCreationStore";
import { formatParseFloat } from "@/utils/utils";
import { useWatch } from "react-hook-form";

/**
 * LabelledScoreInput component for displaying and editing the average score of a student.
 *
 * @param item - The score item containing the student's name and their average score.
 * @param id - The unique identifier for the student.
 * @param form - The react-hook-form instance for managing form state.
 */
export function LabelledScoreInput(props: LabelledScoreInputProps) {
  const { setStudentOverallScore } = useEvaluationStepsCreationStore();

  const { form, id, item } = props;
  const watchId = `overallScore.${id}` as const;

  /**
   * Make sure to sync the overallScore with the student's entry in the store -
   *
   * @description This allows us to make sure the server receives the updated overall score for each student as it can be updated in real-time.
   */
  useWatch({
    control: form?.control,
    name: watchId,
    compute: (score) => {
      if (Number.isFinite(score)) {
        setStudentOverallScore(id, score as number);
      }
    },
  });

  return (
    <LabelledScore item={item}>
      <ControlledLabelledInput
        name={watchId}
        control={form?.control}
        type="number"
        min={0}
        max={20}
        step={0.25}
        defaultValue={formatParseFloat(item.score / 5)}
      />
    </LabelledScore>
  );
}
