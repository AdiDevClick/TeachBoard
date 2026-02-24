import { EvaluationSliderList } from "@/components/Sliders/exports/sliders.exports";
import { Badge } from "@/components/ui/badge.tsx";
import {
  debugLogs,
  stepThreeControllerPropsInvalid,
} from "@/configs/app-components.config.ts";
import { useStudentEvaluation } from "@/features/evaluations/create/steps/three/hooks/useStudentEvaluation";
import type { StepThreeControllerProps } from "@/features/evaluations/create/steps/three/types/step-three.types.ts";

/**
 * Step Three Students Evaluation Controller.
 *
 * @description This handles the evaluation of students for the selected sub-skill once a module is selected
 *
 * @param formId - The ID of the form
 * @param students - The list of students to be evaluated
 * @param className - Additional class names for the form
 */
export function StepThreeStudentsEvaluationController(
  props: StepThreeControllerProps,
) {
  const { calculatedScoreValue, handleValueChange } = useStudentEvaluation();

  if (stepThreeControllerPropsInvalid(props)) {
    debugLogs("StepThreeStudentsEvaluationController", props);
    return null;
  }

  const { formId, students } = props;

  return (
    <form id={formId}>
      <EvaluationSliderList
        items={students}
        optional={(student) => {
          return {
            value: calculatedScoreValue(student.id),
          };
        }}
        onValueChange={handleValueChange}
      />
      {students.length === 0 && (
        <Badge variant={"outline"} className="mx-auto">
          Aucuns étudiants spécifiés pour cette compétence.
        </Badge>
      )}
    </form>
  );
}
