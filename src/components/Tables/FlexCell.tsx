import type { FlexCellProps } from "@/components/Tables/types/table.types";
import { TableCell } from "@/components/ui/table";
import { flexRender } from "@tanstack/react-table";

/**
 * Renders a cell in the table with flexible content
 *
 * @description Using the flexRender function from @tanstack/react-table to render the cell's content based on its column definition and context.
 *
 * @param cell - The cell object containing the column definition and context for rendering the cell's content.
 */
export function FlexCell<T>({ column, getContext }: FlexCellProps<T>) {
  return (
    <TableCell>{flexRender(column.columnDef.cell, getContext())}</TableCell>
  );
}
