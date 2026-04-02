import { EvaluationTable } from "@/components/Tables/EvaluationTable";
import {
  createActionsColumn,
  createClassNamesColumn,
  createDragColumn,
  createEvaluationDateColumn,
  createSelectionColumn,
  createTitleColumn,
} from "@/components/Tables/functions/table-columns.functions";
import { Button } from "@/components/ui/button";
import { API_ENDPOINTS } from "@/configs/api.endpoints.config";
import { useEvaluationTableStore } from "@/features/evaluations/main/configs/evaluations.configs";
import type { EvaluationsMainProps } from "@/features/evaluations/main/types/evaluations.types";
import { useCommandHandler } from "@/hooks/database/classes/useCommandHandler";
import { IconPlus } from "@tabler/icons-react";
import type { ColumnDef } from "@tanstack/react-table";
import { useEffect, useEffectEvent } from "react";
import z from "zod";

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
const columns: ColumnDef<EvaluationSchemaRow>[] = [
  createDragColumn((item) => item.id),
  createSelectionColumn(),
  createClassNamesColumn(),
  createTitleColumn(),
  createEvaluationDateColumn(),
  createActionsColumn(),
];

const schema = z.object({
  id: z.string(),
  title: z.string(),
  comments: z.string().optional(),
  classId: z.string(),
  className: z.string(),
  evaluationDate: z.string(),
  userId: z.string(),
  absentStudentNames: z.array(z.string()),
  // attendedModules: z.array(
  //   z.object({
  //     id: z.string(),
  //     name: z.string(),
  //     code: z.string(),
  //   }),
  // ),
  evaluations: z.array(
    z.object({
      studentId: z.string(),
      studentName: z.string(),
      // id: z.string(),
      isPresent: z.boolean(),
      overallScore: z.number().min(0).max(20).nullable(),
      assignedTaskName: z.string(),
      // assignedTaskId: z.string(),
      // modules: z.array(
      //   z.object({
      //     id: z.string(),
      //     subSkills: z.array(
      //       z.object({
      //         id: z.string(),
      //         score: z.number().min(0).max(100),
      //       }),
      //     ),
      //   }),
      // ),
    }),
  ),
});

export type EvaluationSchemaRow = z.infer<typeof schema>;

/**
 * Evaluation page
 *
 * @description Display a table of evaluations with columns: Classe, Titre, Date d'évaluation, Élèves évalués, Statut, Actions.
 */
export function EvaluationsMain({
  apiEndpoint = API_ENDPOINTS.GET.EVALUATIONS.endpoints.OVERVIEWS,
  dataReshapeFn = API_ENDPOINTS.GET.EVALUATIONS.dataReshape,
  task = "evaluation-overview",
}: EvaluationsMainProps) {
  const { openingCallback, data } = useCommandHandler({
    form: null!,
    pageId: task,
    submitDataReshapeFn: dataReshapeFn,
  });

  /**
   * Initial data fetch
   */
  const fetchInit = useEffectEvent(() => {
    openingCallback(true, {
      dataReshapeFn,
      apiEndpoint,
      task,
    });
  });

  /**
   * Init Store data & columns
   */
  useEffect(() => {
    useEvaluationTableStore.setState({
      columns,
    });
    fetchInit();
  }, []);

  /**
   * Data parsing and store initialization
   *
   * @description When the data is fetched and updated, it is parsed using the defined Zod schema.
   *
   * @see `schema` for the expected data structure.
   */
  useEffect(() => {
    if (data === undefined || data === null) return;

    const parseResult = z.array(schema).safeParse(data);
    if (!parseResult.success) {
      throw new Error("EvaluationsMain: response does not match schema", {
        cause: parseResult.error,
      });
    }

    const store = useEvaluationTableStore.getState();
    const parsedData = parseResult.data;

    if (store.data.length === 0) {
      useEvaluationTableStore.setState({ data: parsedData });
    }
  }, [data]);

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
