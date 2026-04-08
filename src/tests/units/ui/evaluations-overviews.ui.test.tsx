import { useAppStore } from "@/api/store/AppStore";
import { API_ENDPOINTS } from "@/configs/api.endpoints.config";
import { EvaluationsMain } from "@/features/evaluations/main/Evaluations";
import {
  EVALUATION_TABLE_STORE_NAME,
  useEvaluationTableStore,
} from "@/features/evaluations/main/configs/evaluations.configs";
import { AppTestWrapper } from "@/tests/components/AppTestWrapper";
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
});
