import { useEvaluationStepsCreationStore } from "@/features/evaluations/create/store/EvaluationStepsCreationStore";
import type { UseEvaluationsHydrationProps } from "@/features/evaluations/edit/hooks/types/use-evaluations-edit.types";
import { selectClassFromStore } from "@/features/evaluations/main/functions/evaluations-view.functions";
import { useEffect, useMemo } from "react";

/**
 * Hook containing the logic for the EvaluationsEdit component
 *
 * @description Responsible for rehydrating the evaluation creation store with the fetched evaluation details
 */
export function useEvaluationsHydration({
  selectedClass,
  evaluationData,
}: UseEvaluationsHydrationProps) {
  const selectedClassFromStore = useEvaluationStepsCreationStore(
    (state) => state.selectedClass,
  );

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
  }, [evaluationData?.classId, selectedClass, selectedClassFromStore]);

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
}
