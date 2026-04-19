import {
  content,
  evaluationPageContentContainer,
} from "@/assets/css/EvaluationPage.module.scss";
import { StepThree } from "@/features/evaluations/create/steps/three/StepThree";
import { useEvaluationStepsCreationStore } from "@/features/evaluations/create/store/EvaluationStepsCreationStore";
import { AppTestWrapper } from "@/tests/components/AppTestWrapper";
import { getEvaluationStepClassSummaryFixture } from "@/tests/samples/ui-fixtures/evaluation-next-step.ui.fixtures";
import { setupUiTestState } from "@/tests/test-utils/class-creation/class-creation.ui.shared";
import { Outlet, type RouteObject } from "react-router-dom";
import { describe, expect, test } from "vitest";

function StepThreeOutletHost() {
  return (
    <div className={evaluationPageContentContainer}>
      <div className={content}>
        <Outlet context={[null, () => null]} />
      </div>
    </div>
  );
}

const routes: RouteObject[] = [
  {
    path: "/",
    element: <StepThreeOutletHost />,
    children: [
      {
        index: true,
        element: <StepThree />,
      },
    ],
  },
];

const { selectedClass, studentId, taskId, moduleId, resetClassId } =
  getEvaluationStepClassSummaryFixture();

setupUiTestState(
  () => {
    return <AppTestWrapper routes={routes} initialEntries={["/"]} />;
  },
  {
    beforeEach: () => {
      const store = useEvaluationStepsCreationStore.getState();

      store.clear(resetClassId);
      store.setSelectedClass(selectedClass);
      store.setStudentPresence(studentId, true);
      store.setStudentTaskAssignment(taskId, studentId);
      store.setModuleSelection({
        isClicked: false,
        selectedModuleIndex: 0,
        selectedModuleId: moduleId,
      });
    },
  },
);

describe("StepThree transitions UI", () => {
  test("déclenche puis termine la transition module -> evaluation", async () => {
    await expect
      .poll(() => document.querySelector("#step-three-module") != null)
      .toBe(true);
    await expect
      .poll(() => document.querySelector("#step-three-evaluation") != null)
      .toBe(true);

    useEvaluationStepsCreationStore
      .getState()
      .setModuleSelectionIsClicked(true);

    await expect
      .poll(() => {
        const moduleCard =
          document.querySelector<HTMLElement>("#step-three-module");
        const evaluationCard = document.querySelector<HTMLElement>(
          "#step-three-evaluation",
        );

        if (!moduleCard || !evaluationCard) return false;

        return (
          moduleCard.style.animation.includes("step-three-module-out") &&
          evaluationCard.style.animation.includes("step-three-evaluation-in")
        );
      })
      .toBe(true);

    await expect
      .poll(() => {
        const moduleCard =
          document.querySelector<HTMLElement>("#step-three-module");
        const evaluationCard = document.querySelector<HTMLElement>(
          "#step-three-evaluation",
        );

        if (!moduleCard || !evaluationCard) return false;

        return (
          moduleCard.style.animation.includes("step-three-module-out") &&
          evaluationCard.style.animation.includes("step-three-evaluation-in")
        );
      })
      .toBe(true);

    const moduleCard =
      document.querySelector<HTMLElement>("#step-three-module");
    const evaluationCard = document.querySelector<HTMLElement>(
      "#step-three-evaluation",
    );

    expect(moduleCard).not.toBeNull();
    expect(evaluationCard).not.toBeNull();

    moduleCard!.dispatchEvent(
      new AnimationEvent("animationend", {
        animationName: "step-three-module-out",
        bubbles: true,
      }),
    );
    evaluationCard!.dispatchEvent(
      new AnimationEvent("animationend", {
        animationName: "step-three-evaluation-in",
        bubbles: true,
      }),
    );

    // Verify both cards are still in the DOM after animation ends (no crash/unmount).
    // With the style.animation approach, animations are set inline and not removed after
    // animationend — the cleanup is handled by the next render cycle (state dictates styles).
    expect(
      document.querySelector<HTMLElement>("#step-three-module"),
    ).not.toBeNull();
    expect(
      document.querySelector<HTMLElement>("#step-three-evaluation"),
    ).not.toBeNull();
  });

  test("déclenche puis termine la transition evaluation -> module", async () => {
    useEvaluationStepsCreationStore
      .getState()
      .setModuleSelectionIsClicked(true);

    await expect
      .poll(() => {
        const evaluationCard = document.querySelector<HTMLElement>(
          "#step-three-evaluation",
        );
        return (
          evaluationCard?.style.animation.includes(
            "step-three-evaluation-in",
          ) ?? false
        );
      })
      .toBe(true);

    // Simulate the module-out animation completing so that isModuleLoaded becomes true.
    // This is required because moduleCardAnimation only shows "step-three-module-in"
    // once isModuleLoaded is true (set by the animationend handler).
    const moduleCardForSetup =
      document.querySelector<HTMLElement>("#step-three-module");
    moduleCardForSetup!.dispatchEvent(
      new AnimationEvent("animationend", {
        animationName: "step-three-module-out",
        bubbles: true,
      }),
    );

    // Wait for isModuleLoaded to be reflected (module animation changes after state update)
    await expect
      .poll(() => {
        const moduleCard =
          document.querySelector<HTMLElement>("#step-three-module");
        return (
          moduleCard?.style.animation.includes("step-three-module-out") ?? false
        );
      })
      .toBe(true);

    useEvaluationStepsCreationStore
      .getState()
      .setModuleSelectionIsClicked(false);

    await expect
      .poll(() => {
        const moduleCard =
          document.querySelector<HTMLElement>("#step-three-module");
        const evaluationCard = document.querySelector<HTMLElement>(
          "#step-three-evaluation",
        );

        if (!moduleCard || !evaluationCard) return false;

        return (
          evaluationCard.style.animation.includes(
            "step-three-evaluation-out",
          ) && moduleCard.style.animation.includes("step-three-module-in")
        );
      })
      .toBe(true);

    await expect
      .poll(() => {
        const moduleCard =
          document.querySelector<HTMLElement>("#step-three-module");
        const evaluationCard = document.querySelector<HTMLElement>(
          "#step-three-evaluation",
        );

        if (!moduleCard || !evaluationCard) return false;

        return (
          moduleCard.style.animation.includes("step-three-module-in") &&
          evaluationCard.style.animation.includes("step-three-evaluation-out")
        );
      })
      .toBe(true);

    const moduleCard =
      document.querySelector<HTMLElement>("#step-three-module");
    const evaluationCard = document.querySelector<HTMLElement>(
      "#step-three-evaluation",
    );

    expect(moduleCard).not.toBeNull();
    expect(evaluationCard).not.toBeNull();

    evaluationCard!.dispatchEvent(
      new AnimationEvent("animationend", {
        animationName: "step-three-evaluation-out",
        bubbles: true,
      }),
    );
    moduleCard!.dispatchEvent(
      new AnimationEvent("animationend", {
        animationName: "step-three-module-in",
        bubbles: true,
      }),
    );

    // Verify both cards are still in the DOM after animation ends (no crash/unmount).
    expect(
      document.querySelector<HTMLElement>("#step-three-module"),
    ).not.toBeNull();
    expect(
      document.querySelector<HTMLElement>("#step-three-evaluation"),
    ).not.toBeNull();
  });
});
