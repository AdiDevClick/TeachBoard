import withListMapper from "@/components/HOCs/withListMapper";
import { ControlledLabelledInput } from "@/components/Inputs/LaballedInputForController";
import { Badge } from "@/components/ui/badge";
import type { LabelledScoreInputProps } from "@/features/evaluations/create/components/Score/types/score-types";
import { useEvaluationStepsCreationStore } from "@/features/evaluations/create/store/EvaluationStepsCreationStore";
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
    <div className="grid grid-cols-9 gap-2 justify-items-center items-center">
      <Badge className="m-4 justify-self-start col-start-1 col-end-6">
        {item.name}
      </Badge>
      <p className="col-start-6 col-end-8">{"Moyenne : "}</p>
      <ControlledLabelledInput
        className="col-start-8 col-end-9 text-center p-0"
        name={watchId}
        form={form}
        defaultValue={item.score / 5}
      />
      <p className="col-start-9">{"/20"}</p>
    </div>
  );
}

export const LabelledScoreInputList = withListMapper(LabelledScoreInput);
