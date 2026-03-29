import { DragHandle } from "@/components/Tables/DragHandle";
import { EvaluationActionsCell } from "@/components/Tables/EvaluationActionsCell";
import { EvaluationClassCell } from "@/components/Tables/EvaluationClassCell";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import type { EvaluationItem } from "@/features/evaluations/main/types/evaluations-listing.types";
import type { UniqueIdentifier } from "@dnd-kit/core";
import type {
  CellContext,
  ColumnDef,
  HeaderContext,
} from "@tanstack/react-table";

/**
 * Create the drag column for row reordering in the table.
 *
 * @param getItemId - A function that takes an item and returns its unique identifier, used for drag-and-drop operations.
 */
export function createDragColumn<T>(
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
export function createSelectionColumn<T>(): ColumnDef<T> {
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
  T extends EvaluationItem,
>(): ColumnDef<T> {
  return {
    accessorKey: "className",
    header: "Classe",
    cell: ({ row }: CellContext<T, unknown>) => (
      <EvaluationClassCell item={row.original} />
    ),
    enableHiding: false,
  };
}

/**
 * Create the diploma column for the evaluation table, which displays the name of the diploma associated with each evaluation.
 */
export function createDiplomaColumn<T extends EvaluationItem>(): ColumnDef<T> {
  return {
    accessorKey: "diplomaName",
    header: "Diplôme",
  };
}

/**
 * Create the evaluation date column for the evaluation table, which formats the evaluation date as a localized string in French.
 */
export function createEvaluationDateColumn<
  T extends EvaluationItem,
>(): ColumnDef<T> {
  return {
    accessorKey: "evaluationDate",
    header: "Date d'évaluation",
    cell: ({ row }: CellContext<T, unknown>) =>
      new Date(row.original.evaluationDate).toLocaleDateString("fr-FR"),
  };
}

/**
 * Create the student count column for the evaluation table, which displays the number of students evaluated in each evaluation.
 */
export function createStudentCountColumn<
  T extends EvaluationItem,
>(): ColumnDef<T> {
  return {
    accessorKey: "studentCount",
    header: "Élèves évalués",
  };
}

/**
 * Create the status column for the evaluation table, which displays the status of each evaluation as a badge (e.g., "Terminée" for completed evaluations and "Brouillon" for drafts).
 */
export function createStatusColumn<T extends EvaluationItem>(): ColumnDef<T> {
  return {
    accessorKey: "status",
    header: "Statut",
    cell: ({ row }: CellContext<T, unknown>) => {
      const status = row.original.status;
      return (
        <Badge
          variant={status === "completed" ? "default" : "outline"}
          className="px-1.5 text-muted-foreground"
        >
          {status === "completed" ? "Terminée" : "Brouillon"}
        </Badge>
      );
    },
  };
}

/**
 * Create the actions column for the evaluation table, which renders a cell with action buttons (e.g., view details, edit, delete) for each evaluation.
 */
export function createActionsColumn<T extends EvaluationItem>(): ColumnDef<T> {
  return {
    id: "actions",
    cell: ({ row }: CellContext<T, unknown>) => (
      <EvaluationActionsCell item={row.original} />
    ),
  };
}
