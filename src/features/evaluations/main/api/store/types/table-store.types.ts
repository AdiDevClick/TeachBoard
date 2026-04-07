import type {
  ColumnDef,
  ColumnFiltersState,
  PaginationState,
  RowSelectionState,
  SortingState,
  VisibilityState,
} from "@tanstack/react-table";

export interface TableState<T> {
  data: T[];
  columns: ColumnDef<T>[];
  rowSelection: RowSelectionState;
  sorting: SortingState;
  columnVisibility: VisibilityState;
  columnFilters: ColumnFiltersState;
  pagination: PaginationState;
  hasHydrated: boolean;
}

/**
 * A type representing a row item with a unique identifier, which can be either a string or a number. This is used to ensure that each row in the table has a unique ID for proper state management and operations like sorting, filtering, and selection.
 */
export type RowItemWithId = { id: string | number };
