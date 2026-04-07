import { useEvaluationTableStore } from "@/features/evaluations/main/configs/evaluations.configs";
import type { UseEvaluationsViewFetchProps } from "@/features/evaluations/main/hooks/types/use-evaluations-view-fetch.types";
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

  /**
   * Store first, then cached query, then fetch
   */
  const evaluationData = () => {
    let data = getReadyData(parsedEvalId);

    if (!data) {
      data = evaluationCacheCallback();
      updateItem(parsedEvalId, data!);
    }
    return data;
  };

  /**
   * Fetch evaluation -
   *
   * @description Triggers setFetchParams
   */
  const tryFetchEvaluation = useEffectEvent((endpoint: string) => {
    if (!endPoint || evaluationData()) {
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

  return {
    evaluationData: evaluationData(),
  };
}
