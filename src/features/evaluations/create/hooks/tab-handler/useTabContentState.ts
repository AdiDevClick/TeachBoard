import { useEvaluationStepsCreationStore } from "@/features/evaluations/create/store/EvaluationStepsCreationStore";
import { useShallow } from "zustand/shallow";

/**
 * Custom hook to manage the state of the tab content in the evaluation creation process.
 *
 * @returns An object containing the selected class, modules, completion status of modules, module selection state, and a function to set the module selection click status.
 */
export function useTabContentState() {
  const selectedClass = useEvaluationStepsCreationStore(
    (state) => state.selectedClass,
  );

  const moduleSelectionState = useEvaluationStepsCreationStore(
    (state) => state.moduleSelection,
  );

  const areStudentsWithAssignedTask = useEvaluationStepsCreationStore(
    useShallow((state) => state.areStudentsWithAssignedTasks()),
  );

  const areAllModulesCompleted = useEvaluationStepsCreationStore(
    useShallow((state) => state.areAllModulesCompleted()),
  );

  const setShowStudentsEvaluation = useEvaluationStepsCreationStore(
    (state) => state.setModuleSelectionIsClicked,
  );

  return {
    selectedClass,
    areAllModulesCompleted,
    moduleSelectionState,
    setShowStudentsEvaluation,
    areStudentsWithAssignedTask,
  };
}
