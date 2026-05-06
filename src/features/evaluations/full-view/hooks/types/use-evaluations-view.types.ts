import type { EvaluationsViewControllerProps } from "@/features/evaluations/full-view/types/evaluations.types";

/**
 * Type definition for the properties accepted by the useEvaluationsView hook.
 */
export type UseEvaluationsViewProps = Readonly<
  Pick<EvaluationsViewControllerProps, "evaluationData">
>;
