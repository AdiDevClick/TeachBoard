import type { EvaluationEdit } from "@/features/evaluations/edit/EvaluationEdit";

/**
 * Props for the useEvaluationEditFetch hook, combining necessary parameters for fetching evaluation and class data.
 */
export type UseEvaluationEditFetchProps = {
  endpoints: Pick<
    Required<Parameters<typeof EvaluationEdit>[0]>,
    "evalEndpoint" | "classEndpoint"
  >;
  reshapeFns: Pick<
    NonNullable<Parameters<typeof EvaluationEdit>[0]>,
    "evalDataReshapeFn" | "classDataReshapeFn"
  >;
  tasks: Pick<
    Required<NonNullable<Parameters<typeof EvaluationEdit>[0]>>,
    "evalTask" | "classTask"
  >;
};
