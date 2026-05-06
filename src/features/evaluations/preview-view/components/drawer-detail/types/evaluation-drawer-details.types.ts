import type { DetailedEvaluationView } from "@/features/evaluations/main/models/evaluations-view.models";

/**
 * Props for the DetailContent component, which is responsible for displaying the details of a specific evaluation in a drawer.
 */
export type DetailContentProps = Readonly<{
  evaluation: DetailedEvaluationView;
}>;
