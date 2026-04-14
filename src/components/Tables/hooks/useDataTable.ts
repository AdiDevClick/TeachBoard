import { useTablesStores } from "@/features/evaluations/main/api/store/TableStore";
import type { RowItemWithId } from "@/features/evaluations/main/api/store/types/table-store.types";
import { DEFAULT_PERSIST_NAME } from "@/utils/TableStoreRegistry";
import {
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
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
} from "@tanstack/react-table";
import { useId } from "react";

/**
 * Custom hook to create a data table with integrated state management using a specified store.
 *
 * @description This hook sets up the table configuration, including columns, sorting, filtering, pagination, and drag-and-drop reordering functionality.
 *
 * @param storeName - The name of the store to use for managing the table's state. Defaults to a predefined constant if not provided.
 *
 * @returns An object containing the table instance, columns, data IDs, sensors for drag-and-drop, and a handler for drag end events.
 */
export function useDataTableWithStore<T extends RowItemWithId>(
  storeName: string = DEFAULT_PERSIST_NAME,
) {
  // mandatory
  "use no memo";

  const {
    data: storeData,
    columns: storeColumns,
    sorting,
    columnVisibility,
    rowSelection,
    getItemId: storeGetItemId,
    setData,
    setColumnFilters,
    setRowSelection,
    setColumnVisibility,
    setPagination,
    setSorting,
    columnFilters,
    pagination,
  } = useTablesStores<T>(storeName);

  const getItemId = storeGetItemId;
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
    autoResetPageIndex: false,
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
