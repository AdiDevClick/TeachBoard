import { useEvaluationStepsCreationStore } from "@/features/evaluations/create/store/EvaluationStepsCreationStore";
import { selectClassMetas } from "@/features/evaluations/main/functions/evaluations-view.functions";
import type { UseEvaluationsViewFetchProps } from "@/features/evaluations/main/hooks/types/use-evaluations-view-fetch.types";
import type { DetailedEvaluationView } from "@/features/evaluations/main/models/evaluations-view.models";
import { useCommandHandler } from "@/hooks/database/classes/useCommandHandler";
import { parseToUuid } from "@/utils/utils";
import { useEffect, useEffectEvent, useMemo } from "react";
import { useParams } from "react-router-dom";

/**
 * Hook responsible for fetching and managing the evaluation and class data for the EvaluationsView component.
 */
export function useEvaluationsViewFetch({
  pageId,
  evalEndpoint,
  evalDataReshapeFn,
  classEndpoint,
  classDataReshapeFn,
  classTask,
}: UseEvaluationsViewFetchProps) {
  const { evaluationId } = useParams();
  const {
    openingCallback: fetchEvaluationCallback,
    resultsCallback: evaluationCacheCallback,
  } = useCommandHandler({
    pageId,
    form: null!,
  });

  const {
    openingCallback: fetchClassCallback,
    resultsCallback: classCacheCallback,
  } = useCommandHandler({
    pageId: classTask,
    form: null!,
  });

  const evaluationData = evaluationCacheCallback<DetailedEvaluationView>();
  const classData = classCacheCallback();

  const parsedEvalId = parseToUuid(evaluationId);
  const endPoint = evalEndpoint(parsedEvalId ?? "");

  const { selectedClass: selectedClassFromStore } =
    useEvaluationStepsCreationStore();

  /**
   * Fetch evaluation -
   *
   * @description Triggers setFetchParams
   */
  const fetchEvaluation = useEffectEvent((endpoint: string) => {
    fetchEvaluationCallback(true, {
      apiEndpoint: endpoint,
      dataReshapeFn: evalDataReshapeFn,
      task: pageId,
    });
  });

  /**
   * Fetch evaluation -
   *
   * @description On component mount or when evaluationId changes.
   */
  useEffect(() => {
    if (!endPoint) {
      return;
    }

    fetchEvaluation(endPoint);
  }, [endPoint]);

  /**
   * Fetch Class details -
   *
   * @description Triggers setFetchParams
   */
  const fetchClassDetails = useEffectEvent((classId: string) => {
    fetchClassCallback(true, {
      apiEndpoint: classEndpoint(classId),
      dataReshapeFn: classDataReshapeFn,
      task: classTask,
    });
  });

  /**
   * Memoized selected class data for display and store hydration, derived from the fetched class data.
   */
  const selectedClassDatasMemo = useMemo(() => {
    if (!classData) {
      return null;
    }

    return selectClassMetas(classData);
  }, [classData]);

  /**
   * Fetch Class details -
   *
   * @description Once evaluation details are fetched
   */
  useEffect(() => {
    const classId = evaluationData?.classId;
    const matchedStoreClassId = selectedClassFromStore?.id;

    if (
      !classId ||
      selectedClassDatasMemo?.id === classId ||
      matchedStoreClassId === classId
    ) {
      return;
    }

    fetchClassDetails(classId);
  }, [
    evaluationData?.classId,
    selectedClassDatasMemo?.id,
    selectedClassFromStore,
  ]);

  return {
    evaluationData,
    classData,
    selectedClassDatasMemo,
  };
}
