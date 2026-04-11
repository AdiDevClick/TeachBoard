import { useEvaluationTableStore } from "@/features/evaluations/main/configs/evaluations.configs";
import type { UseEvaluationsViewFetchProps } from "@/features/evaluations/main/hooks/types/use-evaluations-view-fetch.types";
import type { DetailedEvaluationView } from "@/features/evaluations/main/models/evaluations-view.models";
import { useCommandHandler } from "@/hooks/database/classes/useCommandHandler";
import { parseToUuid } from "@/utils/utils";
import { useEffect, useEffectEvent } from "react";
import { useParams } from "react-router-dom";

/**
 * Hook responsible for fetching and managing the evaluation for the EvaluationsView component.
 */
export function useEvaluationsViewFetch({
  task,
  endpoint,
  reshapeFn,
}: UseEvaluationsViewFetchProps) {
  const { evaluationId } = useParams();
  const { getReadyData, updateItem } = useEvaluationTableStore();
  const {
    resultsCallback: evaluationCacheCallback,
    openingCallback: fetchEvaluationCallback,
  } = useCommandHandler({
    pageId: task,
    form: null!,
  });

  const parsedEvalId = parseToUuid(evaluationId) ?? "";
  const endPoint = endpoint(parsedEvalId);
  const storeEvaluationData = getReadyData(parsedEvalId);
  const shouldFetch = !!endPoint && !storeEvaluationData;

  fetchEvaluationCallback(shouldFetch, {
    apiEndpoint: endPoint,
    dataReshapeFn: reshapeFn,
    task,
  });

  const resolvedEvaluationData =
    storeEvaluationData ?? evaluationCacheCallback();

  /**
   * Sync evaluation to the store -
   */
  const syncResolvedEvaluationData = useEffectEvent(
    (dataToSync: DetailedEvaluationView | undefined) => {
      if (!parsedEvalId || storeEvaluationData || !dataToSync) {
        return;
      }

      updateItem(parsedEvalId, dataToSync);
    },
  );

  /**
   * Sync resolved evaluation data to the store -
   *
   * @description When resolvedEvaluationData changes
   */
  useEffect(() => {
    syncResolvedEvaluationData(resolvedEvaluationData);
  }, [resolvedEvaluationData, storeEvaluationData]);

  return {
    evaluationData: resolvedEvaluationData,
  };
}
