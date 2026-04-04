import type { EvaluationsViewProps } from "@/features/evaluations/main/types/evaluations.types";

/**
 * Props for the useEvaluationsViewFetch hook, combining necessary parameters for fetching evaluation and class data.
 */
export type UseEvaluationsViewFetchProps = Required<
  Pick<
    EvaluationsViewProps,
    | "pageId"
    | "evalEndpoint"
    | "evalDataReshapeFn"
    | "classEndpoint"
    | "classDataReshapeFn"
    | "classTask"
  >
>;
