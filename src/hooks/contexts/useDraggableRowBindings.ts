import { DraggableRowContext } from "@/api/contexts/DraggableRow.context";
import { use } from "react";

/**
 * Custom hook to access draggable row bindings from DraggableRowContext
 *
 * @throws Error if used outside of DraggableRowProvider
 */
export function useDraggableRowBindings() {
  const context = use(DraggableRowContext);

  if (!context) {
    throw new Error(
      "useDraggableRowBindings must be used within a DraggableRowProvider",
    );
  }

  return context;
}
