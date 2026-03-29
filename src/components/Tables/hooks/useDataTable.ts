import {
  DEFAULT_PERSIST_NAME,
  getTableStore,
  type RowItemWithId,
  type TableStoreSelector,
} from "@/features/evaluations/main/api/store/TableStore";
import type { EvaluationItem } from "@/features/evaluations/main/types/evaluations-listing.types";
import {
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type UniqueIdentifier,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import {
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";
import { useEffect, useEffectEvent, useId, useRef } from "react";

type UseDataTableOptions<T extends RowItemWithId> = Readonly<{
  data?: T[];
  columns?: ColumnDef<T>[];
  getItemId?: (item: T) => UniqueIdentifier;
  onReorder?: (reorderedData: T[]) => void;
}>;

type EvaluationDataTableInput =
  | string
  | Readonly<
      {
        storeName?: string;
      } & UseDataTableOptions<EvaluationItem>
    >;

function resolveEvaluationDataTableInput(input?: EvaluationDataTableInput): {
  storeName: string;
  options: UseDataTableOptions<EvaluationItem>;
} {
  if (!input) {
    return {
      storeName: DEFAULT_PERSIST_NAME,
      options: {},
    };
  }

  if (typeof input === "string") {
    return {
      storeName: input,
      options: {},
    };
  }

  return {
    storeName: input.storeName ?? DEFAULT_PERSIST_NAME,
    options: {
      data: input.data,
      columns: input.columns,
      getItemId: input.getItemId,
      onReorder: input.onReorder,
    },
  };
}

/**
 * Gère l'état complet d'un DataTable : tri, filtrage, pagination, visibilité
 * des colonnes, sélection de lignes et réordonnancement drag-and-drop.
 *
 * Synchroniée automatiquement les données internes lorsque la péop data changà,
 * ce qui évite d'avoir à remoîter le composant pour rafraîchir l'affichage.
 */
export function useDataTableWithStore<T extends RowItemWithId>(
  useStore: TableStoreSelector<T>,
  options: UseDataTableOptions<T> = {},
) {
  // mandatory
  "use no memo";

  const {
    data: initialData,
    columns: initialColumns,
    getItemId: getItemIdOverride,
    onReorder,
  } = options;

  const isInitialStateHydrated = useRef(false);

  const {
    data: storeData,
    columns: storeColumns,
    sorting,
    columnVisibility,
    rowSelection,
    getItemId: storeGetItemId,
    setData,
    setColumns,
    setColumnFilters,
    setRowSelection,
    setColumnVisibility,
    setPagination,
    setSorting,
    columnFilters,
    pagination,
  } = useStore();

  const hydrateInitialState = useEffectEvent(() => {
    if (isInitialStateHydrated.current) {
      return;
    }

    if (initialColumns && storeColumns.length === 0) {
      setColumns(initialColumns);
    }

    if (initialData && storeData.length === 0) {
      setData(initialData);
    }

    if (initialColumns || initialData) {
      isInitialStateHydrated.current = true;
    }
  });

  useEffect(() => {
    hydrateInitialState();
  }, [initialColumns, initialData, storeColumns.length, storeData.length]);

  const getItemId = getItemIdOverride ?? storeGetItemId;

  const sortableId = useId();

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 120, tolerance: 6 },
    }),
    useSensor(KeyboardSensor, {}),
  );

  const dataIds = storeData.map((item) => getItemId(item));

  const table = useReactTable({
    data: storeData,
    columns: storeColumns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination,
    },
    getRowId: (row) => String(getItemId(row)),
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (active && over && active.id !== over.id) {
      const oldIndex = dataIds.indexOf(active.id);
      const newIndex = dataIds.indexOf(over.id);

      const reordered = arrayMove(storeData, oldIndex, newIndex);

      setData(reordered);
      onReorder?.(reordered);
    }
  }

  return {
    getItemId,
    columns: storeColumns,
    table,
    dataIds,
    sensors,
    sortableId,
    handleDragEnd,
  };
}

/**
 * Backward compatible API for the default evaluation table store.
 */
export function useDataTable(input?: EvaluationDataTableInput) {
  const { storeName, options } = resolveEvaluationDataTableInput(input);
  const useStore = getTableStore(storeName);

  return useDataTableWithStore(useStore, options);
}
