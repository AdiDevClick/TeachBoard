import { useEvaluationStepsCreationStore } from "@/features/evaluations/create/store/EvaluationStepsCreationStore";
import { useShallow } from "zustand/shallow";

/**
 * Custom hook to manage state for Step Four of the evaluation creation process.
 *
 * @returns An object containing the relevant state and actions for Step Four, including non-present students, selected class, modules, evaluated students for sub-skills, average scores, and a function to get the score value for a student and sub-skill.
 */
export function useStepFourState() {
  // State
  const nonPresentStudents = useEvaluationStepsCreationStore(
    useShallow((state) => state.nonPresentStudentsResult),
  );

  // Getters
  const selectedClass = useEvaluationStepsCreationStore(
    (state) => state.selectedClass,
  );

  const modules = useEvaluationStepsCreationStore(
    useShallow((state) => state.getAttendedModules()),
  );

  const getEvaluatedStudentsForSubSkill = useEvaluationStepsCreationStore(
    useShallow((state) => state.getPresentStudentsWithAssignedTasks),
  );

  const allStudentsAverageScores = useEvaluationStepsCreationStore(
    useShallow((state) => state.getAllStudentsAverageScores()),
  );

  const scoreValue = useEvaluationStepsCreationStore(
    useShallow((state) => state.getStudentScoreForSubSkill),
  );

  const getAllPresentStudents = useEvaluationStepsCreationStore(
    useShallow((state) => state.getAllPresentStudents()),
  );

  return {
    scoreValue,
    nonPresentStudents,
    allStudentsAverageScores,
    modules,
    getEvaluatedStudentsForSubSkill,
    getAllPresentStudents,
    selectedClass,
  };
}
