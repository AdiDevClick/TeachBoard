import { useEvaluationStepsCreationStore } from "@/features/evaluations/create/store/EvaluationStepsCreationStore";
import {
  selectClassFromStore,
  studentPresence,
} from "@/features/evaluations/main/functions/evaluations-view.functions";
import type { UseEvaluationsViewProps } from "@/features/evaluations/main/hooks/types/use-evaluations-view.types";
import { useEffect, useMemo } from "react";
import { useShallow } from "zustand/shallow";

/**
 * Hook containing the logic for the EvaluationsView component
 *
 * @description Responsible for fetching and processing evaluation data based on the ID from the URL
 */
export function useEvaluationsView({
  selectedClass,
  evaluationData,
}: UseEvaluationsViewProps) {
  const modules = useEvaluationStepsCreationStore(
    useShallow((state) => state.getAttendedModules()),
  );

  const {
    nonPresentStudentsResult: nonPresentStudents,
    getAllStudentsAverageScores,
    getPresentStudentsWithAssignedTasks,
    getStudentScoreForSubSkill: scoreValue,
    selectedClass: selectedClassFromStore,
  } = useEvaluationStepsCreationStore();

  /**
   * Memoized selected class for hydration, derived from either the fetched class data or the store
   */
  const selectedClassForHydration = useMemo(() => {
    if (selectedClass) {
      return selectedClass;
    }

    return selectClassFromStore(
      selectedClassFromStore,
      evaluationData?.classId,
    );
  }, [evaluationData, selectedClass, selectedClassFromStore]);

  /**
   * Rehydrate the evaluation creation store with the fetched evaluation details.
   */
  useEffect(() => {
    if (!evaluationData || !selectedClassForHydration) {
      return;
    }

    useEvaluationStepsCreationStore
      .getState()
      .rehydrateFromEvaluationPayload(
        selectedClassForHydration,
        evaluationData,
      );
  }, [evaluationData, selectedClassForHydration]);

  /**
   * Generates a list of absent students names to display.
   */
  const presence = evaluationData
    ? studentPresence(nonPresentStudents, evaluationData)
    : {
        students: [],
      };

  const scores = getAllStudentsAverageScores();

  const studentsAverageScores = useMemo(
    () => Array.from(scores.entries()),
    [scores],
  );

  return {
    scoreValue,
    studentsAverageScores,
    modules,
    getPresentStudentsWithAssignedTasks,
    presence,
  };
}
