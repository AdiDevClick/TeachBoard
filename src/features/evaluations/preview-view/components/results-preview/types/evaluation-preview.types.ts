/**
 * @file EvaluationResultsPreviewProps type definition
 */

import type { DetailedEvaluationView } from "@/features/evaluations/main/models/evaluations-view.models";

/**
 * Props for the EvaluationResultsPreview component, representing a single evaluation's preview information.
 */
export type EvaluationResultsPreviewProps = Readonly<
  DetailedEvaluationView["evaluations"][number]
>;
