import { preventDefaultAndStopPropagation } from "@/utils/utils";
import type { MouseEvent } from "react";
import type { useNavigate } from "react-router-dom";

/**
 * Handles the click event for each action in the evaluation actions menu. Depending on the label of the action, it navigates to the appropriate route for consulting, editing, or deleting the evaluation.
 *
 * @param e - The mouse event
 * @param label - The label of the action
 * @param id - The ID of the evaluation
 * @param navigate - The navigation function from react-router-dom
 */
export function handleActionOnClick(
  e: MouseEvent<HTMLDivElement>,
  label: string,
  id: string,
  navigate: ReturnType<typeof useNavigate>,
) {
  preventDefaultAndStopPropagation(e);
  if (label === "Consulter") {
    navigate(`/evaluations/TP/opened/${id}`);
  }
  if (label === "Editer") {
    navigate(`/evaluations/edit/${id}`);
  }
  if (label === "Supprimer") {
    navigate(`/evaluations/delete/${id}`);
  }
}
