import type { AppDialogNames } from "@/configs/app.config";
import type { EvaluationDrawer } from "@/features/evaluations/preview-view/exports/drawer.exports";
import type { ComponentProps } from "react";

/**
 * Type definitions for the properties accepted by the EvaluationDetailDrawerRoute component
 */
export type EvaluationDrawerRouteProps = {
  /** Optional ID for the page/dialog, used for managing the state of the drawer in which the EvaluationDetailDrawer component is rendered.
   * @default "evaluation-summary"
   */
  pageId?: AppDialogNames;
} & ComponentProps<typeof EvaluationDrawer>["drawerContent"];
