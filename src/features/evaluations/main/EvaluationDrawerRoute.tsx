import { API_ENDPOINTS } from "@/configs/api.endpoints.config";
import { EvaluationDetailDrawer } from "@/features/evaluations/main/components/drawer-detail/EvaluationDetailDrawer";
import { useEvaluationsViewFetch } from "@/features/evaluations/main/hooks/useEvaluationsViewFetch";
import { preventDefaultAndStopPropagation } from "@/utils/utils";
import { useState, type AnimationEvent } from "react";
import { useNavigate } from "react-router-dom";

/**
 * Manages the state and routing for the EvaluationDetailDrawer
 *
 * @description It fetches the evaluation data based on the ID in the URL and passes it to the drawer.
 * When the drawer is closed, it navigates back to the previous route.
 */
export function EvaluationDetailDrawerRoute() {
  const [open, setOpen] = useState(true);
  const { evaluationData } = useEvaluationsViewFetch({
    task: "evaluation-summary",
    endpoint: API_ENDPOINTS.GET.EVALUATIONS.endpoints.BY_ID,
    reshapeFn: API_ENDPOINTS.GET.EVALUATIONS.dataReshape,
  });
  const navigate = useNavigate();

  const waitAnimationEnd = (e: AnimationEvent<HTMLDivElement>) => {
    preventDefaultAndStopPropagation(e);
    if (!open) navigate("..");
  };

  const evaluation = open ? (evaluationData ?? null) : null;

  return (
    <EvaluationDetailDrawer
      evaluation={evaluation}
      onClose={() => setOpen(false)}
      onAnimationEnd={waitAnimationEnd}
    />
  );
}
