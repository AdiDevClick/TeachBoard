import { UUID_SCHEMA } from "@/api/types/openapi/common.types";
import type { ClassSummaryDto } from "@/api/types/routes/classes.types";
import {
  content,
  evaluationPageContentContainer,
} from "@/assets/css/EvaluationPage.module.scss";
import { StepThree } from "@/features/evaluations/create/steps/three/StepThree";
import { useEvaluationStepsCreationStore } from "@/features/evaluations/create/store/EvaluationStepsCreationStore";
import { AppTestWrapper } from "@/tests/components/AppTestWrapper";
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

const studentId = UUID_SCHEMA.parse("123e4567-e89b-12d3-a456-426614174001");
const taskId = UUID_SCHEMA.parse("123e4567-e89b-12d3-a456-426614174010");
const moduleId = UUID_SCHEMA.parse("123e4567-e89b-12d3-a456-426614174100");
const subSkillId = UUID_SCHEMA.parse("123e4567-e89b-12d3-a456-426614171000");
const resetClassId = UUID_SCHEMA.parse("123e4567-e89b-12d3-a456-426614179999");

const selectedClass: ClassSummaryDto = {
  id: UUID_SCHEMA.parse("123e4567-e89b-12d3-a456-426614174050"),
  name: "Classe test",
  description: "Classe pour test transition step 3",
  degreeConfigName: "CAP Cuisine 2A",
  degreeLevel: "CAP",
  degreeYearCode: "2A",
  degreeYearName: "Deuxième année",
  evaluations: [],
  students: [{ id: studentId, firstName: "John", lastName: "Stud" }],
  templates: [
    {
      id: taskId,
      taskName: "T1",
      task: {
        id: taskId,
        name: "Task 1",
        description: "Template task",
      },
      modules: [
        {
          id: moduleId,
          name: "Module 1",
          code: "M1",
          subSkills: [{ id: subSkillId, name: "Sub 1", code: "SS1" }],
        },
      ],
    },
  ],
};

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
          moduleCard.className.includes("slide-out") &&
          evaluationCard.className.includes("slide-in")
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

    await expect
      .poll(
        () => {
          const moduleCard =
            document.querySelector<HTMLElement>("#step-three-module");
          const evaluationCard = document.querySelector<HTMLElement>(
            "#step-three-evaluation",
          );

          if (!moduleCard || !evaluationCard) return false;

          return (
            !moduleCard.className.includes("slide-out") &&
            !evaluationCard.className.includes("slide-in")
          );
        },
        {
          timeout: 2000,
        },
      )
      .toBe(true);
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
        return evaluationCard?.className.includes("slide-in") ?? false;
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
          evaluationCard.className.includes("slide-out") &&
          moduleCard.className.includes("slide-in")
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

    await expect
      .poll(
        () => {
          const moduleCard =
            document.querySelector<HTMLElement>("#step-three-module");
          const evaluationCard = document.querySelector<HTMLElement>(
            "#step-three-evaluation",
          );

          if (!moduleCard || !evaluationCard) return false;

          return (
            !evaluationCard.className.includes("slide-out") &&
            !moduleCard.className.includes("slide-in")
          );
        },
        {
          timeout: 2000,
        },
      )
      .toBe(true);
  });
});
