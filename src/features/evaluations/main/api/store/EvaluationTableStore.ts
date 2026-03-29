import { DEFAULT_PAGE_SIZE } from "@/components/Tables/configs/table.config";
import type { EvaluationTableState } from "@/features/evaluations/main/api/store/types/evaluation-table-store.types";
import type { EvaluationItem } from "@/features/evaluations/main/types/evaluations-listing.types";
import type {
  ColumnDef,
  ColumnFiltersState,
  PaginationState,
  RowSelectionState,
  SortingState,
  Updater,
  VisibilityState,
} from "@tanstack/react-table";
import { functionalUpdate } from "@tanstack/react-table";
import { create } from "zustand";
import { combine, devtools, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

const DEFAULT_STATE: EvaluationTableState<EvaluationItem> = {
  data: [],
  columns: [],
  rowSelection: {},
  sorting: [],
  columnVisibility: {},
  columnFilters: [],
  pagination: {
    pageIndex: 0,
    pageSize: DEFAULT_PAGE_SIZE,
  },
};

function resolveUpdater<T>(updaterOrValue: Updater<T>, previous: T): T {
  return functionalUpdate(updaterOrValue, previous);
}

/**
 * Dedicated store for managing the state of the evaluation table, including data, pagination, sorting, filtering, and column visibility.
 */
export const useEvaluationTableStore = create(
  devtools(
    persist(
      immer(
        combine(DEFAULT_STATE, (set) => ({
          // GETTERS
          getItemId: (item: EvaluationItem) => item.id,
          // SETTERS
          setData(data: EvaluationItem[]) {
            set(
              (state) => {
                state.data = data;
              },
              false,
              "setData",
            );
          },
          setColumns(columns: ColumnDef<EvaluationItem>[]) {
            set(
              (state) => {
                state.columns = columns;
              },
              false,
              "setColumns",
            );
          },
          setRowSelection(rowSelection: Updater<RowSelectionState>) {
            set(
              (state) => {
                state.rowSelection = resolveUpdater(
                  rowSelection,
                  state.rowSelection,
                );
              },
              false,
              "setRowSelection",
            );
          },
          setSorting(sorting: Updater<SortingState>) {
            set(
              (state) => {
                state.sorting = resolveUpdater(sorting, state.sorting);
              },
              false,
              "setSorting",
            );
          },
          setColumnVisibility(columnVisibility: Updater<VisibilityState>) {
            set(
              (state) => {
                state.columnVisibility = resolveUpdater(
                  columnVisibility,
                  state.columnVisibility,
                );
              },
              false,
              "setColumnVisibility",
            );
          },
          setColumnFilters(columnFilters: Updater<ColumnFiltersState>) {
            set(
              (state) => {
                state.columnFilters = resolveUpdater(
                  columnFilters,
                  state.columnFilters,
                );
              },
              false,
              "setColumnFilters",
            );
          },
          setPagination(pagination: Updater<PaginationState>) {
            set(
              (state) => {
                state.pagination = resolveUpdater(pagination, state.pagination);
              },
              false,
              "setPagination",
            );
          },
        })),
      ),
      {
        name: "evaluation-table-store",
      },
    ),
  ),
);
