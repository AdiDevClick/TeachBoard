import { API_ENDPOINTS } from "@/configs/api.endpoints.config";
import { CreateEvaluations } from "@/features/evaluations/create/CreateEvaluations";
import { useEvaluationsEditFetch } from "@/features/evaluations/edit/hooks/useEvaluationsEditFetch";
import { useEvaluationsHydration } from "@/features/evaluations/edit/hooks/useEvaluationsHydration";
import type { EvaluationEditProps } from "@/features/evaluations/edit/types/evaluation-edit.types";

/**
 * EvaluationsView component that displays the details of an evaluation, including modules, student scores, and comments.
 */
export function EvaluationEdit({
  evalEndpoint = API_ENDPOINTS.GET.EVALUATIONS.endpoints.BY_ID,
  evalDataReshapeFn = API_ENDPOINTS.GET.EVALUATIONS.dataReshape,
  classEndpoint = API_ENDPOINTS.GET.CLASSES.endPoints.BY_ID,
  classDataReshapeFn = API_ENDPOINTS.GET.CLASSES.dataReshapeSingle,
  evalTask = "evaluation-summary",
  classTask = "evaluation-class-selection",
}: EvaluationEditProps) {
  // Fetch Class & Evaluation datas
  const { evaluationData, selectedClassDatasMemo } = useEvaluationsEditFetch({
    tasks: {
      evalTask,
      classTask,
    },
    endpoints: {
      evalEndpoint,
      classEndpoint,
    },
    reshapeFns: {
      evalDataReshapeFn,
      classDataReshapeFn,
    },
  });

  useEvaluationsHydration({
    selectedClass: selectedClassDatasMemo?.selectedClass,
    evaluationData,
  });

  return <CreateEvaluations />;
}
