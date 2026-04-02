import type { UniqueIdentifier } from "@dnd-kit/core";
import type { Cell, Header, HeaderGroup, Row } from "@tanstack/react-table";
import type { ReactNode } from "react";

export type DragHandleProps = Readonly<{
  id: UniqueIdentifier;
}>;

/**
 * Props for the DraggableRow component, which renders a table row that can be dragged and dropped to reorder the rows in the table.
 */
export type DraggableRowProps<T> = Readonly<
  {
    /** A function that returns a unique identifier for an item */
    getItemId: (item: T) => UniqueIdentifier;
  } & Row<T>
>;

export type UseDataTableProps<T> = Readonly<{
  onReorder?: (reorderedData: T[]) => void;
}>;

export type DataTableProps<T> = Readonly<
  UseDataTableProps<T> & {
    toolbarActions?: ReactNode;
    emptyLabel?: string;
  }
>;

/**
 * Props for the Head component, based on the Header type from @tanstack/react-table.
 */
export type HeaderProps<T> = Readonly<Header<T, unknown>>;

/**
 * Props for the Row component, based on the HeaderGroup type from @tanstack/react-table.
 */
export type RowProps<T> = Readonly<HeaderGroup<T>>;

/**
 * Props for the EmptyRow component, which displays a message when there are no rows to show.
 */
export type EmptyRowProps<T> = Partial<HeaderProps<T>> & {
  label: string;
};

/**
 * Props for the FlexCell component, which renders a cell in the table with flexible content.
 */
export type FlexCellProps<T> = Readonly<Cell<T, unknown>>;
