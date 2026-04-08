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
    openingCallback: fetchEvaluationCallback,
    resultsCallback: evaluationCacheCallback,
  } = useCommandHandler({
    pageId: task,
    form: null!,
  });

  const parsedEvalId = parseToUuid(evaluationId) ?? "";
  const endPoint = endpoint(parsedEvalId);
  const storeEvaluationData = getReadyData(parsedEvalId);
  const cachedEvaluationData = evaluationCacheCallback<
    DetailedEvaluationView | undefined
  >();
  const resolvedEvaluationData = storeEvaluationData ?? cachedEvaluationData;

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
   * Fetch evaluation -
   *
   * @description Triggers setFetchParams
   */
  const tryFetchEvaluation = useEffectEvent((endpoint: string) => {
    if (!endpoint || resolvedEvaluationData) {
      return;
    }

    fetchEvaluationCallback(true, {
      apiEndpoint: endpoint,
      dataReshapeFn: reshapeFn,
      task,
    });
  });

  /**
   * Fetch evaluation -
   *
   * @description On component mount or when evaluationId changes.
   */
  useEffect(() => {
    tryFetchEvaluation(endPoint);
  }, [endPoint]);

  /**
   * Sync resolved evaluation data to the store -
   *
   * @description When resolvedEvaluationData changes
   */
  useEffect(() => {
    syncResolvedEvaluationData(resolvedEvaluationData);
  }, [resolvedEvaluationData, parsedEvalId, storeEvaluationData]);

  return {
    evaluationData: resolvedEvaluationData,
  };
}
