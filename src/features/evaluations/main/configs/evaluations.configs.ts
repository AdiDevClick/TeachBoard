import { TABLES_STORES } from "@/features/evaluations/main/api/store/TableStore";
import type { EvaluationSchemaRow } from "@/features/evaluations/main/Evaluations";

/**
 * Name of the store for the evaluation table.
 *
 * @important The store name should be unique for each table to avoid conflicts in state management and persistence.
 */
export const EVALUATION_TABLE_STORE_NAME = "evaluation-table";

/**
 * Export the store getter function for the evaluation table as a hook.
 */
export const useEvaluationTableStore = TABLES_STORES.getStore<
  EvaluationSchemaRow
>(EVALUATION_TABLE_STORE_NAME);
