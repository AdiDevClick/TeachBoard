import withListMapper from "@/components/HOCs/withListMapper";
import { withVerticalDrawer } from "@/components/HOCs/withVerticalDrawer";
import { API_ENDPOINTS } from "@/configs/api.endpoints.config";
import { EvaluationDetailDrawerButton } from "@/features/evaluations/main/components/drawer-button/EvaluationDetailDrawerButton";
import { DetailContent } from "@/features/evaluations/main/components/drawer-detail/EvaluationDetailDrawer";
import { buttonsData } from "@/features/evaluations/main/configs/evaluation-detail-drawer-buttons.configs";
import { useEvaluationsViewFetch } from "@/features/evaluations/main/hooks/useEvaluationsViewFetch";
import { usePageTitle } from "@/hooks/usePageTitle";
import props from "@/utils/props";
import { preventDefaultAndStopPropagation } from "@/utils/utils";
import { useState, type AnimationEvent, type ComponentProps } from "react";
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
  const evaluation = open ? (evaluationData ?? null) : null;

  usePageTitle(evaluation?.title);

  /**
   * Waits for the drawer close animation to end before navigating back to the previous route.
   *
   * @param e - The animation event triggered when the drawer's close animation ends.
   */
  const waitAnimationEnd = (e: AnimationEvent<HTMLDivElement>) => {
    preventDefaultAndStopPropagation(e);
    if (!open) navigate("..");
  };

  const drawerProps = {
    drawerContentProps: { onAnimationEnd: waitAnimationEnd },
    drawerHeader: {
      drawerTitle: { label: evaluation?.title ?? "Détail de l'évaluation" },
      drawerDescription: { label: `— ${evaluation?.className}` },
    },
    drawerFooter: { drawerClose: { label: "Fermer" } },
    drawerContent: {
      evaluation: evaluation ?? undefined,
      ...props,
    },
    open: evaluation !== null,
    onClose: () => setOpen(false),
  } satisfies ComponentProps<typeof EvaluationDrawer>;

  return (
    <EvaluationDrawer {...drawerProps}>
      <EvaluationDrawer.Header />
      {evaluation && <EvaluationDrawer.Content />}
      <EvaluationDrawer.Footer>
        <ButtonsGroup
          items={buttonsData}
          optional={(button) => ({
            to: button.getLink(evaluation?.id ?? ""),
          })}
        />
      </EvaluationDrawer.Footer>
    </EvaluationDrawer>
  );
}

const EvaluationDrawer = withVerticalDrawer(DetailContent);
const ButtonsGroup = withListMapper(EvaluationDetailDrawerButton);
