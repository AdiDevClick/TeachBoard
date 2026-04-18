import type { ACTIONS_LIST } from "@/components/Tables/configs/table.config";
import type { DataTableProps } from "@/components/Tables/types/table.types";
import type { DetailedEvaluationView } from "@/features/evaluations/main/models/evaluations-view.models";

/**
 * Props for the EvaluationTable component, extending the generic DataTableProps with specific types for evaluation items.
 */
export type EvaluationTableProps = DataTableProps<DetailedEvaluationView>;

/**
 * Props for the EvaluationClassCell component, which is a custom cell renderer for the "className" column in the evaluation table.
 */
export type EvaluationClassCellProps<T> = Readonly<{ item: T }>;

/**
 * Props for the EvaluationActionsCell component
 */
export type EvaluationActionsCellProps<T> = Readonly<{
  /** The row item */
  item: T;
  /** A list of available actions */
  actionsList?: typeof ACTIONS_LIST;
}>;
