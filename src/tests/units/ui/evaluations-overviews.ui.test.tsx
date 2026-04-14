import { useAppStore } from "@/api/store/AppStore";
import { API_ENDPOINTS } from "@/configs/api.endpoints.config";
import { EvaluationDetailDrawerRoute } from "@/features/evaluations/main/components/EvaluationDetailDrawer";
import {
  EVALUATION_TABLE_STORE_NAME,
  useEvaluationTableStore,
} from "@/features/evaluations/main/configs/evaluations.configs";
import { EvaluationsMain } from "@/features/evaluations/main/Evaluations";
import type { EvaluationOverview } from "@/features/evaluations/main/models/evaluations-overviews.models";
import { AppTestWrapper } from "@/tests/components/AppTestWrapper";
import { firsteval } from "@/tests/samples/evaluations-payload.datas.tests";
import { setupUiTestState } from "@/tests/test-utils/class-creation/class-creation.ui.shared";
import {
  countFetchCallsByUrl,
  rx,
  stubFetchRoutes,
} from "@/tests/test-utils/vitest-browser.helpers";
import { DEFAULT_PERSIST_NAME } from "@/utils/TableStoreRegistry";
import { set } from "idb-keyval";
import type { RouteObject } from "react-router-dom";
import { describe, expect, test } from "vitest";
import { cleanup, render } from "vitest-browser-react";
import { page } from "vitest/browser";

const overviewsEndpoint = API_ENDPOINTS.GET.EVALUATIONS.endpoints.OVERVIEWS;
const evaluationTablePersistKey = `${DEFAULT_PERSIST_NAME}:${EVALUATION_TABLE_STORE_NAME}`;
const detailPayload = firsteval;
const detailEndpoint = API_ENDPOINTS.GET.EVALUATIONS.endpoints.BY_ID(
  detailPayload.id,
);

const persistedOverview = {
  id: "d86cc857-a7eb-43b9-8abd-aab4e212bd07",
  title: "Evaluation hydratee TP",
  classId: "66f7f95c-68d7-4ca7-9f05-dd489ef3441a",
  className: "TP",
  evaluationDate: "2026-04-02T08:30:00.000Z",
  userId: "4c694ad3-8e9e-464a-b4b4-c21a76c830a8",
  createdAt: "2026-04-02T08:30:00.000Z",
  updatedAt: "2026-04-02T08:30:00.000Z",
};

function buildRoutes(): RouteObject[] {
  return [
    {
      path: "/evaluations/TP",
      element: <EvaluationsMain />,
    },
  ];
}

function buildRoutesWithDrawer(): RouteObject[] {
  return [
    {
      path: "/evaluations/TP",
      element: <EvaluationsMain />,
      children: [
        {
          path: "opened/:evaluationId",
          element: <EvaluationDetailDrawerRoute />,
        },
      ],
    },
  ];
}

function buildOverview(index: number): EvaluationOverview {
  const uuidSuffix = index.toString(16).padStart(12, "0");
  const evaluationDate = `2026-04-${String((index % 28) + 1).padStart(2, "0")}T08:30:00.000Z`;

  return {
    id: `00000000-0000-4000-8000-${uuidSuffix}`,
    title: `Evaluation ${index + 1}`,
    classId: persistedOverview.classId,
    className: persistedOverview.className,
    evaluationDate,
    userId: persistedOverview.userId,
    createdAt: evaluationDate,
    updatedAt: evaluationDate,
  };
}

function buildPaginatedOverviewsWithTarget(
  targetId: string,
): EvaluationOverview[] {
  const rows = Array.from({ length: 10 }, (_, index) => buildOverview(index));

  rows.push({
    ...buildOverview(10),
    id: targetId,
    title: "Evaluation cible fetch drawer",
  });

  return rows;
}

setupUiTestState();

describe("UI flow: evaluations overviews", () => {
  test("does not trigger new GET fetches on /evaluations/TP refresh when idb is already hydrated", async () => {
    stubFetchRoutes({
      getRoutes: [[overviewsEndpoint, []]],
      defaultGetPayload: [],
    });

    useAppStore.setState({
      sessionSynced: false,
      syncValues: { shouldSyncEvaluations: true },
    });

    useEvaluationTableStore.persistMap.idb.clearStorage();
    useEvaluationTableStore.setState({ data: [], hasHydrated: false });

    await set(
      evaluationTablePersistKey,
      JSON.stringify({
        state: { data: [persistedOverview] },
        version: 0,
      }),
    );

    await useEvaluationTableStore.persistMap.idb.rehydrate();

    const routes = buildRoutes();

    await render(
      <AppTestWrapper routes={routes} initialEntries={["/evaluations/TP"]} />,
    );

    await expect
      .poll(
        () => page.getByText(rx(persistedOverview.title)).elements().length > 0,
        { timeout: 1500 },
      )
      .toBe(true);

    await expect
      .poll(() => countFetchCallsByUrl(overviewsEndpoint, "GET"), {
        timeout: 500,
      })
      .toBe(0);

    await cleanup();

    await render(
      <AppTestWrapper routes={routes} initialEntries={["/evaluations/TP"]} />,
    );

    await expect
      .poll(
        () => page.getByText(rx(persistedOverview.title)).elements().length > 0,
        { timeout: 1500 },
      )
      .toBe(true);

    await expect
      .poll(() => countFetchCallsByUrl(overviewsEndpoint, "GET"), {
        timeout: 500,
      })
      .toBe(0);

    useEvaluationTableStore.persistMap.idb.clearStorage();
  });

  test("keeps pagination on current page when drawer fetch updates row data", async () => {
    const seededRows = buildPaginatedOverviewsWithTarget(detailPayload.id);

    stubFetchRoutes({
      getRoutes: [[detailEndpoint, detailPayload]],
      defaultGetPayload: [],
    });

    useAppStore.setState({
      sessionSynced: false,
      syncValues: { shouldSyncEvaluations: true },
    });

    useEvaluationTableStore.persistMap.idb.clearStorage();
    useEvaluationTableStore.setState({
      data: [],
      hasHydrated: false,
      pagination: { pageIndex: 1, pageSize: 10 },
    });

    await set(
      evaluationTablePersistKey,
      JSON.stringify({
        state: { data: seededRows },
        version: 0,
      }),
    );

    await useEvaluationTableStore.persistMap.idb.rehydrate();
    useEvaluationTableStore.setState({
      pagination: { pageIndex: 1, pageSize: 10 },
    });

    await render(
      <AppTestWrapper
        routes={buildRoutesWithDrawer()}
        initialEntries={[`/evaluations/TP/opened/${detailPayload.id}`]}
      />,
    );

    await expect
      .poll(() => countFetchCallsByUrl(detailEndpoint, "GET"), {
        timeout: 1500,
      })
      .toBe(1);

    await expect
      .poll(
        () => page.getByText(rx(detailPayload.title)).elements().length > 0,
        { timeout: 1500 },
      )
      .toBe(true);

    await expect
      .poll(() => page.getByText(rx("Page 2 sur 2")).elements().length > 0, {
        timeout: 1500,
      })
      .toBe(true);
  });
});
