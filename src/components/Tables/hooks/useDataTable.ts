import { useEvaluationTableStore } from "@/features/evaluations/main/api/store/EvaluationTableStore";
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
} from "@tanstack/react-table";
import { useId, useMemo } from "react";

/**
 * Gère l'état complet d'un DataTable : tri, filtrage, pagination, visibilité
 * des colonnes, sélection de lignes et réordonnancement drag-and-drop.
 *
 * Synchroniée automatiquement les données internes lorsque la péop data changà,
 * ce qui évite d'avoir à remoîter le composant pour rafraîchir l'affichage.
 */
export function useDataTable() {
  const {
    data: storeData,
    columns,
    sorting,
    columnVisibility,
    rowSelection,
    getItemId,
    setData,
    setColumnFilters,
    setRowSelection,
    setColumnVisibility,
    setPagination,
    setSorting,
    columnFilters,
    pagination,
  } = useEvaluationTableStore();

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

  const dataIds = useMemo<UniqueIdentifier[]>(
    () => storeData.map((item) => getItemId(item)),
    [getItemId, storeData],
  );

  const table = useReactTable({
    data: storeData,
    columns,
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
    columns,
    table,
    dataIds,
    sensors,
    sortableId,
    handleDragEnd,
  };
}
