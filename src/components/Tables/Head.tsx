import type { HeaderProps } from "@/components/Tables/types/table.types";
import { TableHead } from "@/components/ui/table";
import { flexRender } from "@tanstack/react-table";

/**
 * Table header component that renders the header content using flexRender.
 */
export function Head<T>({
  isPlaceholder,
  colSpan,
  column,
  getContext,
}: HeaderProps<T>) {
  return (
    <TableHead colSpan={colSpan}>
      {!isPlaceholder && flexRender(column.columnDef.header, getContext())}
    </TableHead>
  );
}
