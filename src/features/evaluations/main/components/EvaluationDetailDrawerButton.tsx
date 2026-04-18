import { Button } from "@/components/ui/button";
import type { EvaluationDetailDrawerButtonProps } from "@/features/evaluations/main/components/types/evaluation-detail-drawer-button";
import { Link } from "react-router-dom";

/**
 * A button component that navigates to a specified link when clicked.
 *  It is used in the EvaluationDetailDrawer to provide navigation options for each evaluation.
 *
 * @param label - The text to display on the button.
 * @param to - The URL to navigate to when the button is clicked. If not provided, it defaults to "#".
 * @param props - Additional props to pass to the Button component.
 *
 */
export function EvaluationDetailDrawerButton({
  label,
  to,
  ...buttonProps
}: EvaluationDetailDrawerButtonProps) {
  return (
    <Button variant="outline" asChild {...buttonProps}>
      <Link to={to ?? "#"}>{label}</Link>
    </Button>
  );
}
