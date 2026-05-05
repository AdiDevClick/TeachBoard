import type { EvaluationsViewProps } from "@/features/evaluations/full-view/types/evaluations.types";

/**
 * Props for the useEvaluationsViewFetch hook, combining necessary parameters for fetching evaluation data.
 */
export type UseEvaluationsViewFetchProps = {
  endpoint: NonNullable<EvaluationsViewProps["evalEndpoint"]>;
  reshapeFn: NonNullable<EvaluationsViewProps["evalDataReshapeFn"]>;
  task: NonNullable<EvaluationsViewProps["pageId"]>;
};
