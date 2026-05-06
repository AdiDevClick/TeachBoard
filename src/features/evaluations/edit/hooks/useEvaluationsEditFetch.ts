import type { ClassSummaryDto } from "@/api/types/routes/classes.types";
import { EvaluationPageTabsDatas } from "@/data/EvaluationPageDatas";
import { computeUriSegment } from "@/features/evaluations/create/functions/eval-create-functions";
import { useEvaluationStepsCreationStore } from "@/features/evaluations/create/store/EvaluationStepsCreationStore";
import type { UseEvaluationEditFetchProps } from "@/features/evaluations/edit/hooks/types/use-evaluations-edit-fetch.types";
import { useEvaluationsViewFetch } from "@/features/evaluations/main/hooks/useEvaluationsViewFetch";
import { useCommandHandler } from "@/hooks/database/classes/useCommandHandler";
import { parseFromObject } from "@/utils/utils";
import { useEffect, useEffectEvent, useMemo, useRef } from "react";
import { useLocation } from "react-router-dom";

/**
 * Hook responsible for fetching and managing the evaluation and class data for the EvaluationEdit component.
 */
export function useEvaluationsEditFetch({
  tasks: { evalTask, classTask },
  endpoints: { evalEndpoint, classEndpoint },
  reshapeFns: { evalDataReshapeFn, classDataReshapeFn },
}: UseEvaluationEditFetchProps) {
  const location = useLocation();
  const { evaluationData } = useEvaluationsViewFetch({
    task: evalTask,
    endpoint: evalEndpoint,
    reshapeFn: evalDataReshapeFn,
  });

  const {
    openingCallback: fetchClassCallback,
    resultsCallback: classCacheCallback,
    isLoading: isClassFetching,
  } = useCommandHandler({
    pageId: classTask,
    form: null!,
  });

  const isPendingFetchRef = useRef(false);
  const currentPathSegment = computeUriSegment(location);
  const isClasseRoute =
    currentPathSegment.toLocaleLowerCase() ===
    EvaluationPageTabsDatas.step1.name.toLocaleLowerCase();

  const selectedClassFromStoreId = useEvaluationStepsCreationStore(
    (state) => state.selectedClass?.id,
  );

  /**
   * Memoized selected class data for display and store hydration, derived from the fetched class data.
   */
  const selectedClassDatasMemo = useMemo(() => {
    // Remove proxy before saving to store to avoid hydration issues
    const parsedClass = parseFromObject(
      classCacheCallback(),
    ) as ClassSummaryDto | null;

    if (!parsedClass?.id) return null;

    return {
      id: parsedClass.id,
      selectedClass: parsedClass,
    };
  }, [classCacheCallback]);

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

    isPendingFetchRef.current = true;

    fetchClassCallback(true, {
      apiEndpoint: classEndpoint(classId),
      dataReshapeFn: classDataReshapeFn,
      task: classTask,
      onSuccess: () => {
        isPendingFetchRef.current = false;
      },
      onError: () => {
        isPendingFetchRef.current = false;
      },
    });
  });

  /**
   * Fetch Class details -
   *
   * @description Once evaluation details are fetched
   */
  useEffect(() => {
    const classId = evaluationData?.classId;
    if (
      !classId ||
      isClassFetching ||
      !isClasseRoute ||
      isPendingFetchRef.current
    )
      return;

    fetchClassDetails(classId);
  }, [evaluationData?.classId, isClassFetching, isClasseRoute]);

  return {
    evaluationData,
    selectedClassDatasMemo,
  };
}
