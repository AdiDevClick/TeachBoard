import { DraggableRowProvider } from "@/api/providers/DraggableRow.provider";
import withListMapper from "@/components/HOCs/withListMapper";
import { FlexCell } from "@/components/Tables/FlexCell";
import type {
  DraggableRowProps,
  FlexCellProps,
} from "@/components/Tables/types/table.types";
import { TableRow } from "@/components/ui/table";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

/**
 * A table row component that can be dragged and dropped to reorder items in a table.
 *
 * @description This component uses the useSortable hook from @dnd-kit to enable drag-and-drop functionality.
 * It applies the necessary styles and attributes to make the row draggable and visually indicate when it is being dragged.
 *
 * @note "use no memo" is mandatory to ensure that the component re-renders correctly when the row state changes (e.g., when it is selected or being dragged).
 *
 * @param row - The row data and metadata provided by @tanstack/react-table.
 * @param getItemId - A function that takes an item of type T and returns a unique identifier for that item, used for drag-and-drop operations.
 */
export function DraggableRow<T>({ getItemId, ...row }: DraggableRowProps<T>) {
  //"use no memo";
  const {
    transform,
    transition,
    setNodeRef,
    isDragging,
    attributes,
    listeners,
  } = useSortable({
    id: getItemId(row.original),
  });

  const isSelected = Boolean(row.getIsSelected());

  return (
    <DraggableRowProvider value={{ attributes, listeners }}>
      <TableRow
        // Ensure the key change when the selection state changes to trigger a re-render for styling updates
        key={`table-row-${row.id}-${isSelected ? "selected" : "not-selected"}`}
        data-state={isSelected && "selected"}
        data-dragging={isDragging}
        ref={setNodeRef}
        className="relative z-0 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80"
        style={{
          transform: CSS.Transform.toString(transform),
          transition: transition,
        }}
      >
        <FlexCellList
          items={row.getVisibleCells() as FlexCellProps<unknown>[]}
        />
      </TableRow>
    </DraggableRowProvider>
  );
}

const FlexCellList = withListMapper(FlexCell);
