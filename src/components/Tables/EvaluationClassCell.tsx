import type { EvaluationClassCellProps } from "@/components/Tables/types/evaluation-table.types";
import { Button } from "@/components/ui/button";
import type { DetailedEvaluationView } from "@/features/evaluations/main/models/evaluations-view.models";
import { useNavigate } from "react-router-dom";

/**
 * A custom cell renderer for the "className" column in the evaluation table.
 *
 * @description This component renders the class name as a button. When clicked, it opens navigate to open a drawer with detailed information about the evaluation.
 *
 * @param item - The evaluation item containing the class name and other details to be displayed in the drawer.
 */

export function EvaluationClassCell<T extends DetailedEvaluationView>({
  item,
}: EvaluationClassCellProps<T>) {
  const navigate = useNavigate();

  return (
    <Button
      variant="link"
      className="px-0 text-left text-foreground"
      onClick={() => navigate(`opened/${item.id}`)}
    >
      {item.className}
    </Button>
  );
}
