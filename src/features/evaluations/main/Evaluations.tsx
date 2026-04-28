import { useAppStore } from "@/api/store/AppStore";
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
import { evaluationOverviewsSchema } from "@/features/evaluations/main/models/evaluations-overviews.models";
import type { DetailedEvaluationView } from "@/features/evaluations/main/models/evaluations-view.models";
import type { EvaluationsMainProps } from "@/features/evaluations/main/types/evaluations.types";
import { useCommandHandler } from "@/hooks/database/classes/useCommandHandler";
import { zodParseFromObject } from "@/utils/utils";
import { IconPlus } from "@tabler/icons-react";
import type { ColumnDef } from "@tanstack/react-table";
import { useEffect, useEffectEvent } from "react";
import { Outlet } from "react-router-dom";
import { useShallow } from "zustand/shallow";

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
const columns = [
  createDragColumn((item: DetailedEvaluationView) => item.id),
  createSelectionColumn(),
  createClassNamesColumn(),
  createTitleColumn(),
  createEvaluationDateColumn(),
  createActionsColumn(),
] as ColumnDef<DetailedEvaluationView>[];

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
  const { setState } = useEvaluationTableStore;
  const { openingCallback, data } = useCommandHandler({
    form: null!,
    pageId: task,
    submitDataReshapeFn: dataReshapeFn,
  });
  const { setShouldResyncEvals } = useAppStore();
  const shouldResyncEvals = useAppStore(
    useShallow((state) => state.shouldResyncEvals()),
  );
  const isIdbHydrated = useEvaluationTableStore((state) => state.hasHydrated);
  const isStoreEmpty = useEvaluationTableStore(
    (state) => state.data.length === 0,
  );

  /**
   * Fetch data trigger -
   */
  const fetchInit = useEffectEvent(() => {
    openingCallback(true, {
      dataReshapeFn,
      apiEndpoint,
      task,
    });
  });

  const syncOverviewData = useEffectEvent(() => {
    const parsedResult = zodParseFromObject(data, evaluationOverviewsSchema);

    setState({ data: parsedResult as DetailedEvaluationView[] });
    setShouldResyncEvals(false);
  });

  /**
   * 1 - Init store columns once and fetch initial data after hydration.
   */
  useEffect(() => {
    useEvaluationTableStore.setState({
      columns,
    });
  }, []);

  /**
   * 2 - Fetch data -
   *
   * @description After hydration if the store is empty or if a resync is needed.
   */
  useEffect(() => {
    if ((isIdbHydrated && isStoreEmpty) || shouldResyncEvals) {
      fetchInit();
    }
  }, [isIdbHydrated, isStoreEmpty, shouldResyncEvals]);

  /**
   * 3 - After Fetch - Data parsing after fetch & store initialization
   *
   * @description When the data is fetched and updated, it is parsed using the defined Zod schema.
   *
   * @see `evaluationOverviewsSchema` for the expected data structure.
   */
  useEffect(() => {
    if (data === undefined || data === null) return;

    if (isStoreEmpty || shouldResyncEvals) {
      syncOverviewData();
    }
  }, [data, isStoreEmpty, shouldResyncEvals]);

  return (
    <div className="flex flex-col gap-4 px-4 py-6 lg:px-6">
      <div className="flex items-center justify-between">
        <Button size="sm">
          <IconPlus />
          <span>Nouvelle évaluation</span>
        </Button>
      </div>
      <EvaluationTable />
      <Outlet />
    </div>
  );
}
