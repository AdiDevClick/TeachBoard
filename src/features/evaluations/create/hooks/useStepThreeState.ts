import { useEvaluationStepsCreationStore } from "@/features/evaluations/create/store/EvaluationStepsCreationStore.ts";
import { useShallow } from "zustand/shallow";

/**
 * Custom hook to manage state for Step Three of the evaluation creation process.
 *
 * @returns An object containing the relevant state and actions for Step Three.
 */
export function useStepThreeState() {
  // Setters
  const {
    setModuleSelection,
    setSubskillSelection,
    setModuleSelectionIsClicked: setShowStudentsEvaluation,
    setEvaluationForStudent,
    setSubSkillHasCompleted,
    isThisSubSkillCompleted,
  } = useEvaluationStepsCreationStore();

  // States
  const selectedClass = useEvaluationStepsCreationStore(
    (state) => state.selectedClass,
  );
  const tasks = useEvaluationStepsCreationStore((state) => state.tasks);
  const moduleSelectionState = useEvaluationStepsCreationStore(
    (state) => state.moduleSelection,
  );

  const selectedModuleId = useEvaluationStepsCreationStore(
    (state) => state.moduleSelection.selectedModuleId ?? null,
  );

  const selectedSubSkillId = useEvaluationStepsCreationStore(
    (state) => state.subSkillSelection.selectedSubSkillId,
  );

  // Getters
  const modules = useEvaluationStepsCreationStore(
    useShallow((state) => state.getAttendedModules()),
  );

  const scoreValue = useEvaluationStepsCreationStore(
    (state) => state.getStudentScoreForSubSkill,
  );

  const checkForCompletedModules = useEvaluationStepsCreationStore(
    (state) => state.checkForCompletedModules,
  );

  const evaluatedStudentsForThisSubskill = useEvaluationStepsCreationStore(
    useShallow((state) =>
      state.getPresentStudentsWithAssignedTasks(
        state.subSkillSelection.selectedSubSkillId ?? undefined,
        state.moduleSelection.selectedModuleId ?? undefined,
      ),
    ),
  );

  const disableSubSkillsWithoutStudents = useEvaluationStepsCreationStore(
    useShallow((state) => state.disableSubSkillsWithoutStudents),
  );

  const selectedModule = useEvaluationStepsCreationStore(
    useShallow((state) => state.getSelectedModule()),
  );

  const subSkills = useEvaluationStepsCreationStore(
    useShallow((state) => state.getSelectedModuleSubSkills()),
  );

  const selectedSubSkill = useEvaluationStepsCreationStore(
    useShallow((state) =>
      state.getSelectedSubSkill(
        selectedSubSkillId ?? undefined,
        selectedModuleId ?? undefined,
      ),
    ),
  );

  return {
    selectedClass,
    tasks,
    modules,
    moduleSelectionState,
    setShowStudentsEvaluation,
    selectedSubSkill,
    selectedModule,
    evaluatedStudentsForThisSubskill,
    setModuleSelection,
    setSubskillSelection,
    selectedModuleId,
    checkForCompletedModules,
    selectedSubSkillId,
    subSkills,
    scoreValue,
    disableSubSkillsWithoutStudents,
    setEvaluationForStudent,
    setSubSkillHasCompleted,
    isThisSubSkillCompleted,
  };
}
