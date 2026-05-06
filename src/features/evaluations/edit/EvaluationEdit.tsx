import type { UUID } from "@/api/types/openapi/common.types";
import { API_ENDPOINTS } from "@/configs/api.endpoints.config";
import { CreateEvaluations } from "@/features/evaluations/create/CreateEvaluations";
import { useEvaluationStepsCreationStore } from "@/features/evaluations/create/store/EvaluationStepsCreationStore";
import { useEvaluationsEditFetch } from "@/features/evaluations/edit/hooks/useEvaluationsEditFetch";
import { useEvaluationsHydration } from "@/features/evaluations/edit/hooks/useEvaluationsHydration";
import type { EvaluationEditProps } from "@/features/evaluations/edit/types/evaluation-edit.types";
import { usePageTitle } from "@/hooks/usePageTitle";
import { useEffect, useEffectEvent } from "react";

const { endpoints, dataReshape } = API_ENDPOINTS.GET.EVALUATIONS;
const { endPoints, dataReshapeSingle } = API_ENDPOINTS.GET.CLASSES;

const defaultEndpoints = {
  evalEndpoint: endpoints.BY_ID,
  classEndpoint: endPoints.BY_ID,
};

const defaultReshapeFns = {
  evalDataReshapeFn: dataReshape,
  classDataReshapeFn: dataReshapeSingle,
};

/**
 * EvaluationsView component that displays the details of an evaluation, including modules, student scores, and comments.
 */
export function EvaluationEdit({
  endpoints = defaultEndpoints,
  reshapeFns = defaultReshapeFns,
  tasks = {
    evalTask: "evaluation-summary",
    classTask: "evaluation-class-selection",
  },
}: EvaluationEditProps) {
  const { setTitle } = usePageTitle();
  const clearStore = useEvaluationStepsCreationStore((state) => state.clear);

  // Fetch Class & Evaluation datas
  const { evaluationData, selectedClassDatasMemo } = useEvaluationsEditFetch({
    tasks,
    endpoints,
    reshapeFns,
  });

  useEvaluationsHydration({
    selectedClass: selectedClassDatasMemo?.selectedClass,
    evaluationData,
  });

  /**
   * Clear up
   */
  const clearDataAndRestoreTitle = useEffectEvent(() => {
    setTitle("default");
    clearStore(selectedClassDatasMemo?.id as UUID, true);
  });

  /**
   * Clear evaluation data when leaving the edit route tree.
   *
   * @description Keeps the store intact while navigating between edit steps.
   */
  useEffect(() => {
    return () => {
      if (!window.location.pathname.startsWith("/evaluations/edit/")) {
        clearDataAndRestoreTitle();
      }
    };
  }, []);

  return <CreateEvaluations />;
}
