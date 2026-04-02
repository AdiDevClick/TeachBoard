import type { DraggableRowBindingsContext } from "@/api/contexts/types/context.types";
import { createContext } from "react";

/**
 * Context type for Draggable Row, providing the necessary bindings (attributes and listeners) for making a table row draggable using the useSortable hook from @dnd-kit/sortable.
 */
export const DraggableRowContext =
  createContext<DraggableRowBindingsContext | null>(null);
