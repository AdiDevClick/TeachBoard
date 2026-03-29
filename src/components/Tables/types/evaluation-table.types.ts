import type { ACTIONS_LIST } from "@/components/Tables/configs/table.config";
import type { DataTableProps } from "@/components/Tables/types/table.types";
import type { EvaluationItem } from "@/features/evaluations/main/types/evaluations-listing.types";

/**
 * Props for the EvaluationTable component, extending the generic DataTableProps with specific types for evaluation items.
 */
export type EvaluationTableProps = DataTableProps<EvaluationItem>;

/**
 * Props for the EvaluationClassCell component, which is a custom cell renderer for the "className" column in the evaluation table.
 */
export type EvaluationClassCellProps = Readonly<{ item: EvaluationItem }>;

/**
 * Props for the EvaluationActionsCell component
 */
export type EvaluationActionsCellProps = Readonly<{
  /** The row item */
  item: EvaluationItem;
  /** A list of available actions */
  actionsList?: typeof ACTIONS_LIST;
}>;
