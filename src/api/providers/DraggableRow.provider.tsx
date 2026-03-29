import { DraggableRowContext } from "@/api/contexts/DraggableRow.context";
import type { DraggableRowProviderProps } from "@/api/providers/types/draggable-row.provider.types";

/**
 * Provider component for Draggable Row context, supplying the necessary bindings (attributes and listeners) for making a table row draggable using the useSortable hook from @dnd-kit/sortable.
 *
 * @param value - The draggable row bindings (attributes and listeners) to be provided to the context.
 * @param children - The child components that will have access to the draggable row context.
 */
export function DraggableRowProvider({
  value,
  children,
}: DraggableRowProviderProps) {
  return (
    <DraggableRowContext.Provider value={value}>
      {children}
    </DraggableRowContext.Provider>
  );
}
