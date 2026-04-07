import type { EvaluationsViewProps } from "@/features/evaluations/main/types/evaluations.types";

// type Tasks = {
//   evalTask: NonNullable<EvaluationsViewProps["pageId"]>;
//   classTask: NonNullable<EvaluationsViewProps["classTask"]>;
// };

/**
 * Props for the useEvaluationsViewFetch hook, combining necessary parameters for fetching evaluation and class data.
 */
export type UseEvaluationsViewFetchProps = {
  endpoint: NonNullable<EvaluationsViewProps["evalEndpoint"]>;
  reshapeFn: NonNullable<EvaluationsViewProps["evalDataReshapeFn"]>;
  task: NonNullable<EvaluationsViewProps["pageId"]>;
};
