import { Button } from "@/components/ui/button";
import type { EvaluationDetailDrawerButtonProps } from "@/features/evaluations/main/components/types/evaluation-detail-drawer-button";
import sanitizeDOMProps from "@/utils/props";
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
  const sanitizedProps = sanitizeDOMProps(buttonProps, ["getLink"]);

  return (
    <Button variant="outline" asChild {...sanitizedProps}>
      <Link to={to ?? "#"}>{label}</Link>
    </Button>
  );
}
