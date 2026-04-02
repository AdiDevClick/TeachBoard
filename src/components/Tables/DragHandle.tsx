import { DraggableButton } from "@/components/Buttons/DraggableButton";
import type { DragHandleProps } from "@/components/Tables/types/table.types";
import { useDraggableRowBindings } from "@/hooks/contexts/useDraggableRowBindings";

/**
 * A drag handle button for a table row, enabling drag-and-drop reordering.
 *
 * @description Materialized as a small button with a vertical grip icon
 *
 * @param id - Unique ID of the item to be dragged, typically obtained via `getItemId(row.original)`.
 */
export function DragHandle({ id }: DragHandleProps) {
  const { attributes, listeners } = useDraggableRowBindings();

  return (
    <DraggableButton
      data-row-id={id}
      toolTipText="Faites glisser pour réorganiser"
      accessibilityLabel="Déplacer"
      {...attributes}
      {...listeners}
    />
  );
}
