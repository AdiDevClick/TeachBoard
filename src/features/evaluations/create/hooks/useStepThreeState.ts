import { useEvaluationStepsCreationStore } from "@/features/evaluations/create/store/EvaluationStepsCreationStore.ts";
import { useShallow } from "zustand/shallow";

/**
 * Custom hook to manage state for Step Three of the evaluation creation process.
 *
 * @returns An object containing the relevant state and actions for Step Three.
 */
export function useStepThreeState() {
  const selectedClass = useEvaluationStepsCreationStore(
    (state) => state.selectedClass,
  );
  const tasks = useEvaluationStepsCreationStore((state) => state.tasks);
  const modules = useEvaluationStepsCreationStore(
    useShallow((state) => state.getAttendedModules()),
  );
  const moduleSelectionState = useEvaluationStepsCreationStore(
    (state) => state.moduleSelection,
  );

  const setShowStudentsEvaluation = useEvaluationStepsCreationStore(
    (state) => state.setModuleSelectionIsClicked,
  );
  const selectedSubSkill = useEvaluationStepsCreationStore(
    useShallow((state) => state.getSelectedSubSkill()),
  );
  const evaluatedStudentsForThisSubskill = useEvaluationStepsCreationStore(
    useShallow((state) => state.getPresentStudentsWithAssignedTasks()),
  );

  return {
    selectedClass,
    tasks,
    modules,
    moduleSelectionState,
    setShowStudentsEvaluation,
    selectedSubSkill,
    evaluatedStudentsForThisSubskill,
  };
}
