import { DEFAULT_PAGE_SIZE } from "@/components/Tables/configs/table.config";
import type { TableState } from "@/features/evaluations/main/api/store/types/table-store.types";
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

export const DEFAULT_PERSIST_NAME = "evaluation-table-store";

export type RowItemWithId = { id: string | number };

export type TableStoreSlice<T extends RowItemWithId> = TableState<T> & {
  getItemId: (item: T) => RowItemWithId["id"];
  setData: (data: T[]) => void;
  setColumns: (columns: ColumnDef<T>[]) => void;
  setRowSelection: (rowSelection: Updater<RowSelectionState>) => void;
  setSorting: (sorting: Updater<SortingState>) => void;
  setColumnVisibility: (columnVisibility: Updater<VisibilityState>) => void;
  setColumnFilters: (columnFilters: Updater<ColumnFiltersState>) => void;
  setPagination: (pagination: Updater<PaginationState>) => void;
};

export type TableStoreSelector<T extends RowItemWithId> =
  () => TableStoreSlice<T>;

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

function resolvePersistName(storeName?: string): string {
  const normalizedName = storeName?.trim();

  if (!normalizedName || normalizedName === DEFAULT_PERSIST_NAME) {
    return DEFAULT_PERSIST_NAME;
  }

  if (normalizedName.startsWith(`${DEFAULT_PERSIST_NAME}:`)) {
    return normalizedName;
  }

  return `${DEFAULT_PERSIST_NAME}:${normalizedName}`;
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
          combine(createDefaultState<T>(), (set) => ({
            // GETTERS
            getItemId: (item: T) => item.id,
            // SETTERS
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
          name: resolvePersistName(storeName),
        },
      ),
    ),
  );
}

export function createTableStoreGetter<T extends RowItemWithId>() {
  const defaultStore = createTableStore<T>(DEFAULT_PERSIST_NAME);

  const tableStoreRegistry = new Map<string, typeof defaultStore>([
    [DEFAULT_PERSIST_NAME, defaultStore],
  ]);

  function getStore(storeName: string = DEFAULT_PERSIST_NAME) {
    const persistName = resolvePersistName(storeName);
    const existingStore = tableStoreRegistry.get(persistName);

    if (existingStore) {
      return existingStore;
    }

    const store = createTableStore<T>(storeName);
    tableStoreRegistry.set(persistName, store);

    return store;
  }

  return {
    defaultStore,
    getStore,
  };
}

const tableStoreGetter = createTableStoreGetter<EvaluationItem>();

/**
 * Returns one shared store instance per persistence key.
 */
export const getTableStore = tableStoreGetter.getStore;

/**
 * Dedicated store used by the main evaluations table (backward compatible export).
 */
export const useEvaluationTableStore = tableStoreGetter.defaultStore;
