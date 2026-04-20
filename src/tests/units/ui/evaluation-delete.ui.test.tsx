import { API_ENDPOINTS } from "@/configs/api.endpoints.config";
import { EvaluationDelete } from "@/features/evaluations/delete/EvaluationDelete";
import {
  EVALUATION_TABLE_STORE_NAME,
  useEvaluationTableStore,
} from "@/features/evaluations/main/configs/evaluations.configs";
import { AppTestWrapper } from "@/tests/components/AppTestWrapper";
import { setupUiTestState } from "@/tests/test-utils/class-creation/class-creation.ui.shared";
import {
  countFetchCallsByUrl,
  stubFetchRoutes,
} from "@/tests/test-utils/vitest-browser.helpers";
import { DEFAULT_PERSIST_NAME } from "@/utils/TableStoreRegistry";
import { get, set } from "idb-keyval";
import type { RouteObject } from "react-router-dom";
import { describe, expect, test } from "vitest";
import { cleanup, render } from "vitest-browser-react";
import { page } from "vitest/browser";

const evaluationTablePersistKey = `${DEFAULT_PERSIST_NAME}:${EVALUATION_TABLE_STORE_NAME}`;
const evaluationId = "00000000-0000-4000-8000-000000000111";
const deleteEndpoint = API_ENDPOINTS.DELETE.DELETE_EVALUATION(evaluationId);

const persistedEvaluation = {
  id: evaluationId,
  title: "Evaluation à supprimer",
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
      path: "/evaluations/delete/:evaluationId",
      element: <EvaluationDelete />,
    },
    {
      path: "/evaluations/TP",
      element: <div>Evaluations page</div>,
    },
  ];
}

setupUiTestState();

describe("UI flow: evaluation delete", () => {
  test("calls DELETE endpoint and removes item from IDB", async () => {
    stubFetchRoutes({ defaultGetPayload: [] });

    useEvaluationTableStore.persistMap.idb.clearStorage();
    useEvaluationTableStore.setState({
      data: [persistedEvaluation],
      hasHydrated: true,
    });

    await set(
      evaluationTablePersistKey,
      JSON.stringify({ state: { data: [persistedEvaluation] }, version: 0 }),
    );

    await useEvaluationTableStore.persistMap.idb.rehydrate();

    await render(
      <AppTestWrapper
        routes={buildRoutes()}
        initialEntries={[`/evaluations/delete/${evaluationId}`]}
      />,
    );

    await expect
      .poll(() => countFetchCallsByUrl(deleteEndpoint, "DELETE"), {
        timeout: 1500,
      })
      .toBe(1);

    await expect
      .poll(() => page.getByText("Evaluations page").elements().length > 0, {
        timeout: 1500,
      })
      .toBe(true);

    const persistedRaw = await get(evaluationTablePersistKey);
    const persistedJson =
      typeof persistedRaw === "string"
        ? JSON.parse(persistedRaw)
        : persistedRaw;

    const persistedIds = Array.isArray(persistedJson?.state?.data)
      ? persistedJson.state.data.map((item: { id: string }) => item.id)
      : [];

    expect(persistedIds).not.toContain(evaluationId);

    await cleanup();
    useEvaluationTableStore.persistMap.idb.clearStorage();
  });
});
