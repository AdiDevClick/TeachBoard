import type { EmptyRowProps } from "@/components/Tables/types/table.types";
import { TableCell, TableRow } from "@/components/ui/table";

/**
 * An empty row component to display a message when there are no data rows to show in the table.
 *
 * @param colSpan - The number of columns the empty row should span across.
 * @param label - The message to display in the empty row.
 */
export function EmptyRow<T>({ colSpan, label }: EmptyRowProps<T>) {
  return (
    <TableRow>
      <TableCell colSpan={colSpan} className="h-24 text-center">
        {label}
      </TableCell>
    </TableRow>
  );
}
