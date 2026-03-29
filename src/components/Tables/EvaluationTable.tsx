import withListMapper from "@/components/HOCs/withListMapper";
import { DraggableRow } from "@/components/Tables/DraggableRow";
import { EmptyRow } from "@/components/Tables/EmptyRow";
import { RowsList } from "@/components/Tables/exports/data-table.exports";
import { useDataTable } from "@/components/Tables/hooks/useDataTable";
import { TableColumnsFilterToggle } from "@/components/Tables/TableColumnsFilterToggle";
import { TablePagination } from "@/components/Tables/TablePagination";
import type { EvaluationTableProps } from "@/components/Tables/types/evaluation-table.types";
import type { DraggableRowProps } from "@/components/Tables/types/table.types";
import { Table, TableBody, TableHeader } from "@/components/ui/table";
import type { EvaluationItem } from "@/features/evaluations/main/types/evaluations-listing.types";
import { closestCenter, DndContext } from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

/**
 * A table component specifically designed for displaying evaluations.
 *
 * @description It supports features like drag-and-drop reordering, column filtering, and pagination.
 *
 * @note "use no memo" is mandatory to ensure that the component re-renders correctly when the table state changes
 *
 * @param emptyLabel - Custom label to display when there are no evaluations. Defaults to "Aucune évaluation trouvée."
 * @param toolbarActions - Optional React nodes to render in the toolbar (e.g., buttons, filters).
 */
export function EvaluationTable({
  toolbarActions,
  emptyLabel = "Aucune évaluation trouvée.",
}: EvaluationTableProps) {
  // mandatory
  "use no memo";

  const { dataIds, sensors, sortableId, handleDragEnd, table, getItemId } =
    useDataTable();

  const { getState, getHeaderGroups, getRowModel, getAllColumns } = table;

  const rows = getRowModel()?.rows ?? [];
  const columnCount = getAllColumns().length;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-end gap-2 px-4 lg:px-6">
        <TableColumnsFilterToggle />
        {toolbarActions}
      </div>
      <div className="overflow-hidden rounded-lg border">
        <DndContext
          collisionDetection={closestCenter}
          modifiers={[restrictToVerticalAxis]}
          onDragEnd={handleDragEnd}
          sensors={sensors}
          id={sortableId}
        >
          <Table>
            <TableHeader
              // Ensure the key change when the selection state changes to trigger a re-render for styling updates
              key={`table-header-${Object.keys(getState().rowSelection).join("-")}`}
              className="sticky top-0 z-10 bg-muted"
            >
              <RowsList items={getHeaderGroups()} />
            </TableHeader>
            <TableBody className="**:data-[slot=table-cell]:first:w-8">
              {rows.length > 0 ? (
                <SortableContext
                  items={dataIds}
                  strategy={verticalListSortingStrategy}
                >
                  <DraggableRowsList items={rows} getItemId={getItemId} />
                </SortableContext>
              ) : (
                <EmptyRow colSpan={columnCount} label={emptyLabel} />
              )}
            </TableBody>
          </Table>
        </DndContext>
      </div>
      <TablePagination />
    </div>
  );
}

const DraggableRowsList =
  withListMapper<DraggableRowProps<EvaluationItem>>(DraggableRow);
