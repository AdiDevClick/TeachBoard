import { UUID_SCHEMA } from "@/api/types/openapi/common.types";
import { useEvaluationStepsCreationStore } from "@/features/evaluations/create/store/EvaluationStepsCreationStore";
import { useEvaluationsEditFetch } from "@/features/evaluations/edit/hooks/useEvaluationsEditFetch";
import type { UseEvaluationEditFetchProps } from "@/features/evaluations/edit/hooks/types/use-evaluations-edit-fetch.types";
import { act } from "react";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { renderHook } from "vitest-browser-react";

const CLASS_ID = UUID_SCHEMA.parse("123e4567-e89b-12d3-a456-426614174777");
let currentPath = `/evaluations/edit/${CLASS_ID}`;

const mockFetchClassCallback = vi.fn();
let mockClassData: unknown = null;
const mockClassCacheCallback = vi.fn(() => mockClassData);

vi.mock("@/features/evaluations/main/hooks/useEvaluationsViewFetch", () => ({
  useEvaluationsViewFetch: () => ({
    evaluationData: {
      classId: CLASS_ID,
    },
  }),
}));

vi.mock("@/hooks/database/classes/useCommandHandler", () => ({
  useCommandHandler: () => ({
    openingCallback: mockFetchClassCallback,
    resultsCallback: mockClassCacheCallback,
    isLoading: false,
  }),
}));

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>(
    "react-router-dom",
  );

  return {
    ...actual,
    useLocation: () => ({ pathname: currentPath }),
  };
});

describe("useEvaluationsEditFetch", () => {
  beforeEach(() => {
    mockFetchClassCallback.mockClear();
    mockClassCacheCallback.mockClear();
    mockClassData = null;
    currentPath = `/evaluations/edit/${CLASS_ID}`;

    act(() => {
      useEvaluationStepsCreationStore.getState().clear(CLASS_ID, true);
    });
  });

  afterEach(() => {
    act(() => {
      useEvaluationStepsCreationStore.getState().clear(CLASS_ID, true);
    });
  });

  test("retries the class fetch after an interrupted mount is unmounted", async () => {
    const hookProps: UseEvaluationEditFetchProps = {
      tasks: {
        evalTask: "evaluation-summary",
        classTask: "evaluation-class-selection",
      },
      endpoints: {
        evalEndpoint: (evaluationId: string | number) =>
          `/evaluations/${evaluationId}`,
        classEndpoint: (classId: string | number) => `/classes/${classId}`,
      },
      reshapeFns: {
        evalDataReshapeFn: () => ({}),
        classDataReshapeFn: () => ({}),
      },
    };

    const firstHook = await renderHook(() =>
      useEvaluationsEditFetch(hookProps),
    );

    await act(async () => {
      await Promise.resolve();
    });

    expect(mockFetchClassCallback).not.toHaveBeenCalled();

    currentPath = `/evaluations/edit/${CLASS_ID}/classe`;
    firstHook.rerender();

    await act(async () => {
      await Promise.resolve();
    });

    const initialFetchCalls = mockFetchClassCallback.mock.calls.length;
    expect(initialFetchCalls).toBe(1);

    mockClassData = {
      id: CLASS_ID,
      name: "Classe 1",
      students: [],
      templates: [],
      evaluations: null,
    };

    firstHook.rerender();

    expect(mockFetchClassCallback.mock.calls.length).toBe(initialFetchCalls);

    firstHook.unmount();
    mockFetchClassCallback.mockClear();
    mockClassData = null;

    const secondHook = await renderHook(() =>
      useEvaluationsEditFetch(hookProps),
    );

    await act(async () => {
      await Promise.resolve();
    });

    expect(mockFetchClassCallback).toHaveBeenCalled();

    secondHook.unmount();
  });
});