import type { ClassSummaryDto } from "@/api/types/routes/classes.types";
import { useEvaluationStepsCreationStore } from "@/features/evaluations/create/store/EvaluationStepsCreationStore";
import type { UseEvaluationEditFetchProps } from "@/features/evaluations/edit/hooks/types/use-evaluations-edit-fetch.types";
import { useEvaluationsViewFetch } from "@/features/evaluations/main/hooks/useEvaluationsViewFetch";
import { useCommandHandler } from "@/hooks/database/classes/useCommandHandler";
import { parseFromObject } from "@/utils/utils";
import { useEffect, useEffectEvent, useMemo } from "react";

/**
 * Hook responsible for fetching and managing the evaluation and class data for the EvaluationEdit component.
 */
export function useEvaluationsEditFetch({
  tasks: { evalTask, classTask },
  endpoints: { evalEndpoint, classEndpoint },
  reshapeFns: { evalDataReshapeFn, classDataReshapeFn },
}: UseEvaluationEditFetchProps) {
  const { evaluationData } = useEvaluationsViewFetch({
    task: evalTask,
    endpoint: evalEndpoint,
    reshapeFn: evalDataReshapeFn,
  });

  const {
    openingCallback: fetchClassCallback,
    resultsCallback: classCacheCallback,
  } = useCommandHandler({
    pageId: classTask,
    form: null!,
  });

  const classData = classCacheCallback();

  const selectedClassFromStoreId = useEvaluationStepsCreationStore(
    (state) => state.selectedClass?.id,
  );

  /**
   * Memoized selected class data for display and store hydration, derived from the fetched class data.
   */
  const selectedClassDatasMemo = useMemo(() => {
    // Remove proxy before saving to store to avoid hydration issues
    const parsedClass = parseFromObject(classData) as ClassSummaryDto | null;

    if (!parsedClass?.id) return null;

    return {
      id: parsedClass.id,
      selectedClass: parsedClass,
    };
  }, [classData]);

  /**
   * Fetch Class details -
   *
   * @description Triggers setFetchParams
   */
  const fetchClassDetails = useEffectEvent((classId: string) => {
    if (
      selectedClassDatasMemo?.id === classId ||
      selectedClassFromStoreId === classId
    ) {
      return;
    }

    fetchClassCallback(true, {
      apiEndpoint: classEndpoint(classId),
      dataReshapeFn: classDataReshapeFn,
      task: classTask,
    });
  });

  /**
   * Fetch Class details -
   *
   * @description Once evaluation details are fetched
   */
  useEffect(() => {
    const classId = evaluationData?.classId;
    if (!classId) return;

    fetchClassDetails(classId);
  }, [evaluationData?.classId]);

  return {
    evaluationData,
    selectedClassDatasMemo,
  };
}
