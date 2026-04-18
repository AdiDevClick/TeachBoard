import type { EvaluationEditProps } from "@/features/evaluations/edit/types/evaluation-edit.types";

/**
 * Props for the useEvaluationEditFetch hook, combining necessary parameters for fetching evaluation and class data.
 */
export type UseEvaluationEditFetchProps = Readonly<{
  endpoints: Required<NonNullable<EvaluationEditProps["endpoints"]>>;
  reshapeFns: Required<NonNullable<EvaluationEditProps["reshapeFns"]>>;
  tasks: Required<NonNullable<EvaluationEditProps["tasks"]>>;
}>;
