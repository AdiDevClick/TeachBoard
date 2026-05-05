import { useAppStore } from "@/api/store/AppStore";
import { useEvaluationTableStore } from "@/features/evaluations/main/configs/evaluations.configs";
import type { UseEvaluationsViewFetchProps } from "@/features/evaluations/main/hooks/types/use-evaluations-view-fetch.types";
import type { DetailedEvaluationView } from "@/features/evaluations/main/models/evaluations-view.models";
import { useCommandHandler } from "@/hooks/database/classes/useCommandHandler";
import { parseToUuid } from "@/utils/utils";
import { useEffect, useEffectEvent } from "react";
import { useParams } from "react-router-dom";
import { useShallow } from "zustand/shallow";

/**
 * Hook responsible for fetching and managing the evaluation for the EvaluationsView component.
 */
export function useEvaluationsViewFetch({
  task,
  endpoint,
  reshapeFn,
}: UseEvaluationsViewFetchProps) {
  const { evaluationId } = useParams();
  const parsedEvalId = parseToUuid(evaluationId) ?? "";
  const { setShouldResyncEvals } = useAppStore();
  const isStoreEmpty = useEvaluationTableStore(
    (state) => state.data.length === 0,
  );

  const { hasHydrated, updateItem, storeEvaluationData } =
    useEvaluationTableStore(
      useShallow((state) => ({
        hasHydrated: state.hasHydrated,
        updateItem: state.updateItem,
        storeEvaluationData: state.getReadyData(parsedEvalId),
      })),
    );

  const {
    resultsCallback: evaluationCacheCallback,
    openingCallback: fetchEvaluationCallback,
  } = useCommandHandler({
    pageId: task,
    form: null!,
  });

  const endPoint = endpoint(parsedEvalId);
  const shouldFetch =
    hasHydrated && !!endPoint && storeEvaluationData === undefined;

  /**
   * Fetch Evaluation -
   */
  const triggerFetchEvaluation = useEffectEvent(() => {
    fetchEvaluationCallback(shouldFetch, {
      apiEndpoint: endPoint,
      dataReshapeFn: reshapeFn,
      task,
    });
  });

  const resolvedEvaluationData =
    storeEvaluationData ?? evaluationCacheCallback();

  /**
   * Fetch -
   *
   * @description When `storeEvaluationData` is undefined
   */
  useEffect(() => {
    if (!shouldFetch) {
      return;
    }

    triggerFetchEvaluation();
  }, [shouldFetch]);

  /**
   * Sync evaluation to the store -
   */
  const syncResolvedEvaluationData = useEffectEvent(
    (dataToSync: DetailedEvaluationView | undefined) => {
      if (!parsedEvalId || storeEvaluationData || !dataToSync) {
        return;
      }

      updateItem(parsedEvalId, dataToSync);

      // !! IMPORTANT !!Keep the resync flag up to date in case the store was initially empty (one entry can mess the syncing) -
      if (isStoreEmpty) {
        setShouldResyncEvals(true);
      }
    },
  );

  /**
   * Sync resolved evaluation data to the store -
   *
   * @description When resolvedEvaluationData changes
   */
  useEffect(() => {
    syncResolvedEvaluationData(resolvedEvaluationData);
  }, [resolvedEvaluationData]);

  return {
    evaluationData: resolvedEvaluationData,
  };
}
