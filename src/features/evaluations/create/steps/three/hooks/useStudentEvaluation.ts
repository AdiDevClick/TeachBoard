import type { UUID } from "@/api/types/openapi/common.types";
import type { EvaluationSliderProps } from "@/components/Sliders/types/sliders.types";
import { useStepThreeState } from "@/features/evaluations/create/hooks/useStepThreeState";
import type { StudentEvaluationState } from "@/features/evaluations/create/steps/three/controllers/types/studend-evaluation-controller.types";
import type {
  ClassModuleSubSkill,
  ClassModules,
} from "@/features/evaluations/create/store/types/steps-creation-store.types";
import { useEffect, useEffectEvent, useState } from "react";

const defaultState = {
  studentId: null,
  subSkill: null,
  score: null,
  module: null,
};

/**
 * Custom hook to manage student evaluations.
 *
 * @returns An object containing the current evaluation state and handlers.
 */
export function useStudentEvaluation() {
  const [newValue, setNewValue] =
    useState<StudentEvaluationState>(defaultState);

  const {
    setEvaluationForStudent,
    setSubSkillHasCompleted,
    isThisSubSkillCompleted,
    selectedSubSkill,
    selectedModule,
    scoreValue,
  } = useStepThreeState();

  const calculatedScoreValue = (studentId: UUID) => {
    if (!selectedSubSkill?.id || !selectedModule?.id) {
      return null;
    }
    return scoreValue(studentId, selectedSubSkill.id, selectedModule.id);
  };

  /**
   * Handles value change for a student's evaluation.
   *
   * @description Updates the evaluation score for the specified student
   * @param newValue - The new value array from the slider.
   * @param student - The student whose evaluation is being updated.
   */
  const handleValueChange = (
    newValue: number[],
    student?: EvaluationSliderProps,
  ) => {
    if (!student?.id) {
      return;
    }

    setNewValue({
      studentId: student.id,
      subSkill: selectedSubSkill,
      score: newValue[0],
      module: selectedModule,
    });
  };

  /**
   * SAVE EVALUATION -
   *
   * @description - Updates the store with the new evaluation for the student.
   * @param newValue - The new evaluation state for the student.
   */
  const saveEvaluation = useEffectEvent((newValue: StudentEvaluationState) => {
    const { studentId, score, subSkill, module } = newValue;

    if (!studentId || score === null) {
      return;
    }
    setEvaluationForStudent(studentId, {
      subSkill,
      score,
      module,
    });
  });

  /**
   * SAVE EVALUATION -
   *
   * @description - Each time a user changes the slider value
   */
  useEffect(() => {
    saveEvaluation(newValue);
  }, [newValue]);

  /**
   * SUBSKILL EVALUATION - COMPLETION CHECK
   *
   * @description - It checks if the currently selected subskill is completed (all students have a score) and updates the store accordingly.
   *
   * @param selectedSubSkill - The currently selected subskill.
   * @param selectedModule - The currently selected module.
   */
  const checkAndUpdateSubSkillCompletion = useEffectEvent(
    (
      selectedSubSkill: ClassModuleSubSkill | null,
      selectedModule: ClassModules | null,
    ) => {
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
    },
  );

  /**
   * SUBSKILL EVALUATION - COMPLETION CHECK
   *
   * @description When user changes the slider value.
   */
  useEffect(() => {
    checkAndUpdateSubSkillCompletion(selectedSubSkill, selectedModule);
  }, [selectedModule, selectedSubSkill, newValue]);

  return { handleValueChange, calculatedScoreValue };
}
