import type { DraggableRowBindingsContext } from "@/api/contexts/types/context.types";
import type { PropsWithChildren } from "react";

/**
 * Props for the DraggableRowProvider component, which provides the necessary bindings (attributes and listeners) for making a table row draggable using the useSortable hook from @dnd-kit/sortable.
 */
export type DraggableRowProviderProps = Readonly<
  {
    value: DraggableRowBindingsContext;
  } & PropsWithChildren
>;
