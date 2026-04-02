import type { createTableStore } from "@/features/evaluations/main/api/store/TableStore";
import type { RowItemWithId } from "@/features/evaluations/main/api/store/types/table-store.types";

/**
 * Type representing a store instance created by the createTableStore function.
 */
export type Store<T extends RowItemWithId> = ReturnType<
  typeof createTableStore<T>
>;
