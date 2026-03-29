import type {
  ColumnDef,
  ColumnFiltersState,
  PaginationState,
  RowSelectionState,
  SortingState,
  VisibilityState,
} from "@tanstack/react-table";

export interface EvaluationTableState<T> {
  data: T[];
  columns: ColumnDef<T>[];
  rowSelection: RowSelectionState;
  sorting: SortingState;
  columnVisibility: VisibilityState;
  columnFilters: ColumnFiltersState;
  pagination: PaginationState;
}
