import { useEvaluationStepsCreationStore } from "@/api/store/EvaluationStepsCreationStore.ts";
import { EvaluationSliderList } from "@/components/Sliders/EvaluationSlider.tsx";
import type { EvaluationSliderProps } from "@/components/Sliders/types/sliders.types.ts";
import { Badge } from "@/components/ui/badge.tsx";
import {
  debugLogs,
  stepThreeControllerPropsInvalid,
} from "@/configs/app-components.config.ts";
import type { StepThreeControllerProps } from "@/pages/Evaluations/create/steps/three/types/step-three.types.ts";
import { useEffect } from "react";
import { useShallow } from "zustand/shallow";

export function StepThreeStudentsEvaluationController(
  props: StepThreeControllerProps,
) {
  const { formId, students } = props;
  const selectedSubSkill = useEvaluationStepsCreationStore(
    useShallow((state) => state.getSelectedSubSkill()),
  );
  const selectedModule = useEvaluationStepsCreationStore(
    useShallow((state) => state.getSelectedModule()),
  );
  const setEvaluationForStudent = useEvaluationStepsCreationStore(
    (state) => state.setEvaluationForStudent,
  );
  const isThisSubSkillCompleted = useEvaluationStepsCreationStore(
    (state) => state.isThisSubSkillCompleted,
  );
  const setSubSkillHasCompleted = useEvaluationStepsCreationStore(
    (state) => state.setSubSkillHasCompleted,
  );

  const scoreValue = useEvaluationStepsCreationStore(
    useShallow((state) => state.getStudentScoreForSubSkill),
  );

  if (stepThreeControllerPropsInvalid(props)) {
    debugLogs("StepThreeStudentsEvaluationController", props);
  }

  /**
   * Effect to check if the selected sub-skill is completed.
   *
   * @description - This effect runs whenever a user changes the slider value.
   */
  useEffect(() => {
    if (!selectedModule || !selectedSubSkill) {
      return;
    }

    const isCompleted = isThisSubSkillCompleted(
      selectedSubSkill.id,
      selectedModule.id,
    );

    if (selectedSubSkill.isCompleted !== isCompleted) {
      setSubSkillHasCompleted(
        selectedModule.id,
        selectedSubSkill.id,
        isCompleted,
      );
    }
  }, [selectedModule, selectedSubSkill]);

  /**
   * Handles value change for a student's evaluation.
   *
   * @description Updates the evaluation score for the specified student
   * @param newValue - The new value array from the slider.
   * @param student - The student whose evaluation is being updated.
   */
  const handleValueChange = (
    newValue: number[],
    student: EvaluationSliderProps,
  ) => {
    if (!student.id) {
      return;
    }

    setEvaluationForStudent(student.id, {
      subSkill: selectedSubSkill,
      score: newValue[0],
      module: selectedModule,
    });
  };

  return (
    <form id={formId} className="min-w-md">
      <EvaluationSliderList
        items={students}
        optional={(student) => {
          return {
            value: scoreValue(
              student.id,
              selectedSubSkill?.id,
              selectedModule?.id,
            ),
          };
        }}
        onValueChange={handleValueChange}
      />
      {/* <ListMapper items={students}>
        {(student) => {
          return (
            <EvaluationSlider
              key={student.id}
              {...student}
              value={scoreValue(
                student.id,
                selectedSubSkill?.id,
                selectedModule?.id,
              )}
              onValueChange={handleValueChange}
            />
          );
        }}
      </ListMapper> */}
      {students.length === 0 && (
        <Badge variant={"outline"} className="mx-auto">
          Aucuns étudiants spécifiés pour cette compétence.
        </Badge>
      )}
    </form>
  );
}
