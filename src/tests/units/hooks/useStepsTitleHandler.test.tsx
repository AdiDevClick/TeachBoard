import { useStepsTitleHandler } from "@/features/evaluations/create/hooks/useStepsTitleHandler";
import { useEvaluationStepsCreationStore } from "@/features/evaluations/create/store/EvaluationStepsCreationStore";
import { act } from "react";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { renderHook } from "vitest-browser-react";

const pageTitleMock = vi.hoisted(() => {
  return {
    title: undefined as string | null | undefined,
    onSetTitle: (_next: string) => {},
    setTitle: vi.fn<(next: string) => void>(),
  };
});

vi.mock("@/hooks/usePageTitle", () => ({
  usePageTitle: () => ({
    title: pageTitleMock.title,
    setTitle: pageTitleMock.setTitle,
  }),
}));

describe("useStepsTitleHandler", () => {
  beforeEach(() => {
    pageTitleMock.title = undefined;
    pageTitleMock.onSetTitle = () => {};
    pageTitleMock.setTitle.mockReset();
    pageTitleMock.setTitle.mockImplementation((next: string) => {
      pageTitleMock.onSetTitle(next);
    });

    act(() => {
      useEvaluationStepsCreationStore.setState({ title: undefined });
    });
  });

  afterEach(() => {
    act(() => {
      useEvaluationStepsCreationStore.setState({ title: undefined });
    });
  });

  test("regression: does not overwrite stored title when switching steps", async () => {
    pageTitleMock.title = "Titre Step 2";

    act(() => {
      useEvaluationStepsCreationStore.setState({
        title: "Titre personnalisé A",
      });
    });

    const stepTwoHook = await renderHook(() => useStepsTitleHandler(true));

    pageTitleMock.title = "Titre personnalisé B";
    stepTwoHook.rerender();

    expect(useEvaluationStepsCreationStore.getState().title).toBe(
      "Titre personnalisé B",
    );

    stepTwoHook.unmount();

    pageTitleMock.title = "Titre Step 1";
    const stepOneHook = await renderHook(() => useStepsTitleHandler(true));

    stepOneHook.rerender();

    expect(pageTitleMock.setTitle).toHaveBeenCalledWith("Titre personnalisé B");
    expect(useEvaluationStepsCreationStore.getState().title).toBe(
      "Titre personnalisé B",
    );

    stepOneHook.unmount();
  });

  test("syncs user-edited page title back to store after bootstrap", async () => {
    pageTitleMock.onSetTitle = (next: string) => {
      pageTitleMock.title = next;
    };

    pageTitleMock.title = "Titre Step 2";

    act(() => {
      useEvaluationStepsCreationStore.setState({
        title: "Titre personnalisé A",
      });
    });

    const hook = await renderHook(() => useStepsTitleHandler(true));

    hook.rerender();

    pageTitleMock.title = "Titre personnalisé C";
    hook.rerender();

    expect(useEvaluationStepsCreationStore.getState().title).toBe(
      "Titre personnalisé C",
    );

    hook.unmount();
  });

  test("keeps hydrated title when store title changes after init", async () => {
    pageTitleMock.onSetTitle = (next: string) => {
      pageTitleMock.title = next;
    };

    pageTitleMock.title = "Titre Step 1";

    act(() => {
      useEvaluationStepsCreationStore.setState({
        title: "Titre brouillon",
      });
    });

    const hook = await renderHook(() => useStepsTitleHandler());

    hook.rerender();

    act(() => {
      useEvaluationStepsCreationStore.setState({
        title: "Titre hydraté",
      });
    });

    hook.rerender();

    expect(pageTitleMock.setTitle).toHaveBeenCalledWith("Titre hydraté");
    expect(useEvaluationStepsCreationStore.getState().title).toBe(
      "Titre hydraté",
    );

    hook.unmount();
  });
});
