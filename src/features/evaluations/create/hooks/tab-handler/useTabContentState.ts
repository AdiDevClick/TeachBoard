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

  const modules = useEvaluationStepsCreationStore(
    useShallow((state) => state.getAttendedModules()),
  );

  const areAllModulesCompleted = useEvaluationStepsCreationStore(
    useShallow((state) => state.areAllModulesCompleted()),
  );

  const setShowStudentsEvaluation = useEvaluationStepsCreationStore(
    (state) => state.setModuleSelectionIsClicked,
  );

  console.log("called the useTabContentState");
  return {
    selectedClass,
    modules,
    areAllModulesCompleted,
    moduleSelectionState,
    setShowStudentsEvaluation,
  };
}
