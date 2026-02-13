import { ControlledLabelledInput } from "@/components/Inputs/exports/labelled-input";
import { Badge } from "@/components/ui/badge";
import { Item } from "@/components/ui/item";
import type { LabelledScoreInputProps } from "@/features/evaluations/create/components/Score/types/score-types";
import { useEvaluationStepsCreationStore } from "@/features/evaluations/create/store/EvaluationStepsCreationStore";
import { formatParseFloat } from "@/utils/utils";
import {
  labelledScoreInput,
  labelledScoreInputBadge,
  labelledScoreInputInput,
  labelledScoreInputText,
} from "@css/LabelledScoreInput.module.scss";
import { useWatch } from "react-hook-form";
import { useShallow } from "zustand/shallow";

/**
 * LabelledScoreInput component for displaying and editing the average score of a student.
 *
 * @param item - The score item containing the student's name and their average score.
 * @param id - The unique identifier for the student.
 * @param form - The react-hook-form instance for managing form state.
 */
export function LabelledScoreInput(props: LabelledScoreInputProps) {
  const setStudentOverallScore = useEvaluationStepsCreationStore(
    useShallow((state) => state.setStudentOverallScore),
  );

  const { form, id, item } = props;
  const watchId = `overallScore.${id}`;

  /**
   * Make sure to sync the overallScore with the student's entry in the store -
   *
   * @description This allows us to make sure the server receives the updated overall score for each student as it can be updated in real-time.
   */
  useWatch({
    control: form.control,
    name: watchId,
    compute: (score) => {
      setStudentOverallScore(id, score);
    },
  });

  return (
    <Item className={labelledScoreInput}>
      <Badge className={labelledScoreInputBadge}>{item.name}</Badge>
      <p className={labelledScoreInputText}>{"Moyenne : "}</p>
      <div className={labelledScoreInputInput}>
        <ControlledLabelledInput
          name={watchId}
          form={form}
          type="number"
          min={0}
          max={20}
          defaultValue={formatParseFloat(item.score / 5)}
        />
        <p>{"/20"}</p>
      </div>
    </Item>
  );
}
