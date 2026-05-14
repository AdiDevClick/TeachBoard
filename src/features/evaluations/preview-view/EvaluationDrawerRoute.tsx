import { LargeButtonList as InteractionButtonList } from "@/components/Buttons/exports/buttons.exports";
import { Spinner } from "@/components/ui/spinner";
import { API_ENDPOINTS } from "@/configs/api.endpoints.config";
import { buttonsData } from "@/features/evaluations/main/configs/evaluation-detail-drawer-buttons.configs";
import { useEvaluationsViewFetch } from "@/features/evaluations/main/hooks/useEvaluationsViewFetch";
import { EvaluationDrawer } from "@/features/evaluations/preview-view/exports/drawer.exports";
import type { EvaluationDrawerRouteProps } from "@/features/evaluations/preview-view/types/evaluation-preview.types";
import { useDrawer } from "@/hooks/useDrawer";
import { usePageTitle } from "@/hooks/usePageTitle";
import { AppDrawer } from "@/pages/AllDrawers/AppDrawers";
import { type ComponentProps } from "react";

/**
 * Manages the state and routing for the EvaluationDetailDrawer
 *
 * @description It fetches the evaluation data based on the ID in the URL and passes it to the drawer.
 * When the drawer is closed, it navigates back to the previous route.
 */
export function EvaluationDetailDrawerRoute({
  pageId = "evaluation-summary",
  ...props
}: EvaluationDrawerRouteProps) {
  const { evaluationData, error } = useEvaluationsViewFetch({
    task: pageId,
    endpoint: API_ENDPOINTS.GET.EVALUATIONS.endpoints.BY_ID,
    reshapeFn: API_ENDPOINTS.GET.EVALUATIONS.dataReshape,
  });
  const { waitAnimationAndNavigate } = useDrawer({ pageId });
  usePageTitle(evaluationData?.title);

  const drawerContentProps = {
    className: "justify-center",
    onAnimationEnd: waitAnimationAndNavigate,
  } satisfies ComponentProps<typeof AppDrawer>["appDrawerContentProps"];

  const message = error
    ? "Une erreur s'est produite lors du chargement des données. —"
    : "En cours de récupération...";

  const contentProps = {
    drawerHeader: {
      drawerTitle: { label: evaluationData?.title ?? "Détail de l'évaluation" },
      drawerDescription: {
        label: `— ${evaluationData?.className ?? message}`,
      },
    },
    drawerFooter: { drawerClose: { label: "Fermer" } },
    drawerContent: {
      ...props,
      evaluation: evaluationData,
    },
  } satisfies ComponentProps<typeof EvaluationDrawer>;

  return (
    <AppDrawer
      appDrawerName={pageId}
      appDrawerContentProps={drawerContentProps}
    >
      <EvaluationDrawer {...contentProps}>
        <EvaluationDrawer.Header />
        {!evaluationData && !error && (
          <Spinner
            role="status"
            aria-label="Loading"
            className="self-center size-6 animate-spin"
          />
        )}
        {evaluationData && (
          <>
            <EvaluationDrawer.Content />
            <EvaluationDrawer.Footer>
              <InteractionButtonList
                items={buttonsData}
                optional={(button) => ({
                  url: button.getLink(evaluationData?.id ?? ""),
                })}
              />
            </EvaluationDrawer.Footer>
          </>
        )}
      </EvaluationDrawer>
    </AppDrawer>
  );
}
