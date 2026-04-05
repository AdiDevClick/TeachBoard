import { DEFAULT_PAGE_SIZE } from "@/components/Tables/configs/table.config";
import type {
  RowItemWithId,
  TableState,
} from "@/features/evaluations/main/api/store/types/table-store.types";
import { TableStoreRegistry } from "@/utils/TableStoreRegistry";
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

function createDefaultState<T extends RowItemWithId>(): TableState<T> {
  return {
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
}

function resolveUpdater<T>(updaterOrValue: Updater<T>, previous: T): T {
  return functionalUpdate(updaterOrValue, previous);
}

/**
 * Factory for table stores with dynamic persistence names.
 */
export function createTableStore<T extends RowItemWithId>(storeName: string) {
  return create(
    devtools(
      persist(
        immer(
          combine(createDefaultState<T>(), (set, get) => ({
            // GETTERS
            getItemId: (item: T) => item.id,
            hasItem: (itemId: string) => {
              const item = get().data.find((d) => d.id === itemId);
              return item !== undefined;
            },
            // SETTERS
            addItem(item: T) {
              set(
                (state) => {
                  state.data.unshift(item);
                },
                false,
                "addItem",
              );
            },
            setData(data: T[]) {
              set({ data }, false, "setData");
            },
            setColumns(columns: ColumnDef<T>[]) {
              set({ columns }, false, "setColumns");
            },
            setRowSelection(rowSelection: Updater<RowSelectionState>) {
              set(
                (state) => ({
                  rowSelection: resolveUpdater(
                    rowSelection,
                    state.rowSelection,
                  ),
                }),
                false,
                "setRowSelection",
              );
            },
            setSorting(sorting: Updater<SortingState>) {
              set(
                (state) => ({
                  sorting: resolveUpdater(sorting, state.sorting),
                }),
                false,
                "setSorting",
              );
            },
            setColumnVisibility(columnVisibility: Updater<VisibilityState>) {
              set(
                (state) => ({
                  columnVisibility: resolveUpdater(
                    columnVisibility,
                    state.columnVisibility,
                  ),
                }),
                false,
                "setColumnVisibility",
              );
            },
            setColumnFilters(columnFilters: Updater<ColumnFiltersState>) {
              set(
                (state) => ({
                  columnFilters: resolveUpdater(
                    columnFilters,
                    state.columnFilters,
                  ),
                }),
                false,
                "setColumnFilters",
              );
            },
            setPagination(pagination: Updater<PaginationState>) {
              set(
                (state) => ({
                  pagination: resolveUpdater(pagination, state.pagination),
                }),
                false,
                "setPagination",
              );
            },
          })),
        ),
        {
          name: storeName,
        },
      ),
    ),
  );
}

/**
 * Create and centralise tables stores.
 */
export const TABLES_STORES = new TableStoreRegistry();

/**
 * Custom hook to access a table store state by name
 *
 * @param storeName - The name of the table store to access. If not provided, the default store will be used.
 */
export const useTablesStores = <T extends RowItemWithId>(storeName?: string) =>
  TABLES_STORES.getStore<T>(storeName)();
