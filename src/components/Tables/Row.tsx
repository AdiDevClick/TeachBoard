import { Head } from "@/components/Tables/Head";
import type { RowProps } from "@/components/Tables/types/table.types";
import { TableRow } from "@/components/ui/table";

/**
 * Table row component that renders a row of headers using the Head component.
 *
 * @param headers - An array of header groups to be rendered in the row.
 */
export function Row<T>({ headers }: RowProps<T>) {
  return (
    <TableRow>
      {headers.map((header) => (
        <Head key={header.id} {...header} />
      ))}
    </TableRow>
  );
}
