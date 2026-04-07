import { DEFAULT_PAGE_SIZE } from "@/components/Tables/configs/table.config";
import { debugLogs } from "@/configs/app-components.config";
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
import { del, get, set } from "idb-keyval";
import { type Draft } from "immer";
import { create } from "zustand";
import { multiPersist } from "zustand-multi-persist";
import {
  combine,
  createJSONStorage,
  devtools,
  type StateStorage,
} from "zustand/middleware";
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
    hasHydrated: false,
  };
}
const idbStorage: StateStorage = {
  getItem: async (name: string): Promise<string | null> => {
    return (await get(name)) || null;
  },
  setItem: async (name: string, value: string): Promise<void> => {
    await set(name, value);
  },
  removeItem: async (name: string): Promise<void> => {
    await del(name);
  },
};

function resolveUpdater<T>(updaterOrValue: Updater<T>, previous: T): T {
  return functionalUpdate(updaterOrValue, previous);
}

/**
 * Factory for table stores with dynamic persistence names.
 */
export function createTableStore<T extends RowItemWithId>(storeName: string) {
  const store = create(
    devtools(
      multiPersist(
        immer(
          combine(createDefaultState<T>(), (set, get) => {
            const ACTIONS = {
              hasItem: (itemId: string) => {
                return ACTIONS.getDataFromId(itemId) !== undefined;
              },
              // GETTERS
              /**
               * If the item exists in the store and has attendedModules data, it is then ready for a view. Otherwise, return undefined to trigger a fetch in the component.
               */
              getReadyData(itemId: string) {
                const existingData = ACTIONS.getDataFromId(itemId);
                const wasSaved =
                  existingData && existingData.attendedModules?.length > 0;

                return wasSaved ? existingData : undefined;
              },
              getItemId: (item: T) => item.id,
              getDataFromId: (itemId: string) => {
                return get().data.find((d) => d.id === itemId);
              },
              // SETTERS
              updateItem(itemId: string, updatedItem: Partial<T>) {
                if (!itemId || !updatedItem || !ACTIONS.hasItem(itemId)) {
                  debugLogs(`TableStore - ${storeName}`, {
                    type: "all",
                    message: `Trying to update item with id ${itemId} that does not exist in the store or providing invalid data.`,
                    data: { itemId, updatedItem },
                  });
                  return;
                }
                set(
                  (state) => {
                    const index = state.data.findIndex((d) => d.id === itemId);
                    if (index !== -1) {
                      state.data[index] = {
                        ...state.data[index],
                        ...updatedItem,
                      };
                    }
                  },
                  false,
                  "updateItem",
                );
              },
              addItemToTop(item: T) {
                set(
                  (state) => {
                    state.data.unshift(item as Draft<T>);
                  },
                  false,
                  "addItemToTop",
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
            };
            return ACTIONS;
          }),
        ),
        {
          idb: {
            skipHydration: true,
            storage: createJSONStorage(() => idbStorage),
            partialize: (state: TableState<T>) => ({ data: state.data }),
            onRehydrateStorage() {
              // Modify the name so it can be dynamic for any table store created with the factory
              store.persistMap.idb.setOptions({ name: storeName });

              return (state, error) => {
                if (error) {
                  console.warn("an error happened during hydration", error);
                } else {
                  store.setState({ hasHydrated: true });
                }
              };
            },
          },
          local: {
            skipHydration: true,
            storage: createJSONStorage(() => localStorage),
            partialize: (state: TableState<T>) => {
              const rest = { ...state } as Record<string, unknown>;
              delete rest.data;
              delete rest.hasHydrated;
              return rest;
            },
            onRehydrateStorage() {
              // Modify the name so it can be dynamic for any table store created with the factory
              store.persistMap.local.setOptions({ name: storeName });
            },
          },
        },
      ),
    ),
  );

  // !!IMPORTANT!! Manually hydrate so persisted keys match storeName and not "idb" / "local".
  store.persistMap.local.rehydrate();
  store.persistMap.idb.rehydrate();

  return store;
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
