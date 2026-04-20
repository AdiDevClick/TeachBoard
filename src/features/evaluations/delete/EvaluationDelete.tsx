import { Spinner } from "@/components/ui/spinner";
import { API_ENDPOINTS } from "@/configs/api.endpoints.config";
import { useEvaluationTableStore } from "@/features/evaluations/main/configs/evaluations.configs";
import { useCommandHandler } from "@/hooks/database/classes/useCommandHandler";
import type { FetchParams } from "@/hooks/database/fetches/types/useFetch.types";
import { useEffect, useEffectEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";

/**
 * Component responsible for handling the deletion of an evaluation
 *
 * @description It fires a delete request to the API and updates the local IDB
 *
 * @remark After successful deletion, it navigates back to the evaluations list.
 *
 * @param pageId - The ID of the page, used for debugging and logging purposes.
 */
export function EvaluationDelete({
  pageId = "evaluation-delete",
}: EvaluationDeleteProps) {
  const { evaluationId } = useParams();
  const navigate = useNavigate();
  const { deleteItem } = useEvaluationTableStore();
  const { setFetchParams, response } = useCommandHandler({
    pageId,
    form: null!,
  });

  const deleteEvaluationUrl = evaluationId
    ? API_ENDPOINTS.DELETE.DELETE_EVALUATION(evaluationId)
    : "";

  /**
   * INIT -
   *
   * @description Triggers the delete API call for the specified evaluation ID.
   */
  const triggerSubmit = useEffectEvent((url: string) => {
    setFetchParams({
      enabled: url !== "",
      contentId: pageId as FetchParams["contentId"],
      url,
      method: API_ENDPOINTS.DELETE.METHOD,
      successDescription() {
        return {
          type: "success",
          descriptionMessage: "Évaluation supprimée avec succès",
        };
      },
    });
  });

  /**
   * INIT -
   *
   * @description When the endpoint is ready
   */
  useEffect(() => {
    if (!evaluationId) return;

    triggerSubmit(deleteEvaluationUrl);
  }, [deleteEvaluationUrl, evaluationId]);

  /**
   * RESPONSE HANDLING -
   */
  const deleteEvaluation = useEffectEvent((id: string) => {
    deleteItem(id);
    navigate("/evaluations/TP");
  });

  /**
   * ON RESPONSE -
   *
   * @description Waits for the delete response
   */
  useEffect(() => {
    if (response) {
      deleteEvaluation(String(evaluationId));
    }
  }, [response, evaluationId]);

  return (
    <div className="flex h-full w-full items-center justify-center">
      <Spinner
        role="status"
        aria-label="Loading"
        className="size-5 animate-spin"
      />
    </div>
  );
}
