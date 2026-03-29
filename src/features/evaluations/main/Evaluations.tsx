import { EvaluationTable } from "@/components/Tables/EvaluationTable";
import {
  createActionsColumn,
  createClassNamesColumn,
  createDiplomaColumn,
  createDragColumn,
  createEvaluationDateColumn,
  createSelectionColumn,
  createStatusColumn,
  createStudentCountColumn,
} from "@/components/Tables/functions/table-columns.functions";
import { Button } from "@/components/ui/button";
import { useEvaluationTableStore } from "@/features/evaluations/main/api/store/TableStore";
import type { EvaluationItem } from "@/features/evaluations/main/types/evaluations-listing.types";
import mockData from "@data/evaluations.mock.datas.json";
import { IconPlus } from "@tabler/icons-react";
import type { ColumnDef } from "@tanstack/react-table";
import { useEffect } from "react";

/**
 * Columns configuration
 *
 * @description All columns are created using the factory functions defined in @see table-columns.functions.tsx
 *
 * @important The order is important
 *
 * @note This can hide components that are not used in the table, but it allows to keep the columns configuration in one place and to easily reuse the column definitions in other tables if needed.
 *
 * @see `table-columns.functions.tsx` for more details on each column definition.
 */
const columns: ColumnDef<EvaluationItem>[] = [
  createDragColumn((item) => item.id),
  createSelectionColumn<EvaluationItem>(),
  createClassNamesColumn<EvaluationItem>(),
  createDiplomaColumn<EvaluationItem>(),
  createEvaluationDateColumn<EvaluationItem>(),
  createStudentCountColumn<EvaluationItem>(),
  createStatusColumn<EvaluationItem>(),
  createActionsColumn<EvaluationItem>(),
];

/**
 * Evaluation page
 *
 * @description Display a table of evaluations with columns: Classe, Diplôme, Date d'évaluation, Élèves évalués, Statut, Actions.
 */
export function EvaluationsMain() {
  useEvaluationTableStore.setState({ columns });

  /**
   * Init Store data & columns
   */
  useEffect(() => {
    const store = useEvaluationTableStore.getState();

    if (store.data.length === 0) {
      useEvaluationTableStore.setState({ data: mockData as EvaluationItem[] });
    }
  }, []);

  return (
    <div className="flex flex-col gap-4 px-4 py-6 lg:px-6">
      <div className="flex items-center justify-between">
        <Button size="sm">
          <IconPlus />
          <span>Nouvelle évaluation</span>
        </Button>
      </div>
      <EvaluationTable />
    </div>
  );
}
