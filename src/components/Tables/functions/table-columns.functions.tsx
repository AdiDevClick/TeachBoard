import { DragHandle } from "@/components/Tables/DragHandle";
import { EvaluationActionsCell } from "@/components/Tables/EvaluationActionsCell";
import { EvaluationClassCell } from "@/components/Tables/EvaluationClassCell";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import type { EvaluationSchemaRow } from "@/features/evaluations/main/Evaluations";
import type { UniqueIdentifier } from "@dnd-kit/core";
import type {
  CellContext,
  ColumnDef,
  HeaderContext,
} from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

/**
 * Create the drag column for row reordering in the table.
 *
 * @param getItemId - A function that takes an item and returns its unique identifier, used for drag-and-drop operations.
 */
export function createDragColumn<T extends EvaluationSchemaRow>(
  getItemId: (item: T) => UniqueIdentifier,
): ColumnDef<T, unknown> {
  return {
    id: "drag",
    header: () => null,
    cell: ({ row }: CellContext<T, unknown>) => (
      <DragHandle id={getItemId(row.original)} />
    ),
  };
}

/**
 * Create the selection column (checkbox) for multiple row selection.
 */
export function createSelectionColumn<
  T extends EvaluationSchemaRow,
>(): ColumnDef<T> {
  return {
    id: "select",
    header: ({ table }: HeaderContext<T, unknown>) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Sélectionner tout"
      />
    ),
    cell: ({ row }: CellContext<T, unknown>) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Sélectionner la ligne"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  };
}

/**
 * Create the class names column for the evaluation table, which renders the class name as a button that opens a detail drawer when clicked.
 */
export function createClassNamesColumn<
  T extends EvaluationSchemaRow,
>(): ColumnDef<T> {
  return {
    accessorKey: "className",
    header: ({ column }) => {
      return (
        <Button
          className="p-0!"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          {"Classe"}
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }: CellContext<T, unknown>) => (
      <EvaluationClassCell item={row.original} />
    ),
    enableHiding: false,
  };
}

/**
 * Create the title column for the evaluation table, which displays the title associated with each evaluation.
 */
export function createTitleColumn<
  T extends EvaluationSchemaRow,
>(): ColumnDef<T> {
  return {
    accessorKey: "title",
    header: ({ column }) => {
      return (
        <Button
          className="p-0!"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Titre
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  };
}

/**
 * Create the evaluation date column for the evaluation table, which formats the evaluation date as a localized string in French.
 */
export function createEvaluationDateColumn<
  T extends EvaluationSchemaRow,
>(): ColumnDef<T> {
  return {
    accessorKey: "evaluationDate",
    header: ({ column }) => {
      return (
        <Button
          className="p-0!"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          {"Date d'évaluation"}
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }: CellContext<T, unknown>) => {
      const date = new Date(row.original.evaluationDate);
      const hour = date.getHours();
      const minute = date.getMinutes();
      const formattedHour = hour.toString().padStart(2, "0");
      const formattedMinute = minute.toString().padStart(2, "0");

      return `Le ${date.toLocaleDateString("fr-FR")} à ${formattedHour}h${formattedMinute}`;
    },
    enableSorting: true,
  };
}

/**
 * Create the actions column for the evaluation table, which renders a cell with action buttons (e.g., view details, edit, delete) for each evaluation.
 */
export function createActionsColumn<
  T extends EvaluationSchemaRow,
>(): ColumnDef<T> {
  return {
    id: "actions",
    cell: ({ row }: CellContext<T, unknown>) => (
      <EvaluationActionsCell item={row.original} />
    ),
  };
}
