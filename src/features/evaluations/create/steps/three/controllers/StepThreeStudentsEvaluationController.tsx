import type { UUID } from "@/api/types/openapi/common.types.ts";
import { EvaluationSliderList } from "@/components/Sliders/EvaluationSlider.tsx";
import type { EvaluationSliderProps } from "@/components/Sliders/types/sliders.types.ts";
import { Badge } from "@/components/ui/badge.tsx";
import {
  debugLogs,
  stepThreeControllerPropsInvalid,
} from "@/configs/app-components.config.ts";
import type { StepThreeControllerProps } from "@/features/evaluations/create/steps/three/types/step-three.types.ts";
import { useEvaluationStepsCreationStore } from "@/features/evaluations/create/store/EvaluationStepsCreationStore.ts";
import type {
  ClassModules,
  ClassModuleSubSkill,
} from "@/features/evaluations/create/store/types/steps-creation-store.types.ts";
import { useEffect, useState } from "react";
import { useShallow } from "zustand/shallow";

type StudentEvaluationState = {
  studentId: UUID | null;
  subSkill: ClassModuleSubSkill | null;
  score: number | null;
  module: ClassModules | null;
};
const defaultState = {
  studentId: null,
  subSkill: null,
  score: null,
  module: null,
};
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
  const {
    setEvaluationForStudent,
    setSubSkillHasCompleted,
    isThisSubSkillCompleted,
  } = useEvaluationStepsCreationStore();

  const scoreValue = useEvaluationStepsCreationStore(
    (state) => state.getStudentScoreForSubSkill,
  );

  const [newValue, setNewValue] =
    useState<StudentEvaluationState>(defaultState);

  if (stepThreeControllerPropsInvalid(props)) {
    debugLogs("StepThreeStudentsEvaluationController", props);
  }

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
    setNewValue({
      studentId: student.id,
      subSkill: selectedSubSkill,
      score: newValue[0],
      module: selectedModule,
    });
  };

  useEffect(() => {
    const { studentId, score, subSkill, module } = newValue;

    if (!studentId || score === null) {
      return;
    }

    setEvaluationForStudent(studentId, {
      subSkill,
      score,
      module,
    });
  }, [newValue]);

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
  }, [selectedModule, selectedSubSkill, newValue]);

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
      {students.length === 0 && (
        <Badge variant={"outline"} className="mx-auto">
          Aucuns étudiants spécifiés pour cette compétence.
        </Badge>
      )}
    </form>
  );
}
