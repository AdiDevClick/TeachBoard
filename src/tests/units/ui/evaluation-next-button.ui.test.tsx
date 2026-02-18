import { TabContent } from "@/features/evaluations/create/components/Tabs/TabContent";
import {
  DEFAULT_VALUES_STEPS_CREATION_STATE,
  useEvaluationStepsCreationStore,
} from "@/features/evaluations/create/store/EvaluationStepsCreationStore";
import { UUID_SCHEMA } from "@/api/types/openapi/common.types";
import type { ClassSummaryDto } from "@/api/types/routes/classes.types";
import type { TabContentHandlerState } from "@/features/evaluations/create/hooks/types/use-tab-content-handler.types";
import { AppTestWrapper } from "@/tests/components/AppTestWrapper";
import { Tabs } from "@/components/ui/tabs";
import { useState, type Dispatch, type SetStateAction } from "react";
import { beforeEach, describe, expect, test } from "vitest";
import { render } from "vitest-browser-react";

function EvaluationElevesHarness() {
  const [slideDirection, setSlideDirection] = useState<"left" | "right">(
    "right",
  );
  const [tabValue, setTabValue] = useState("Elèves");
  const setTabValueSafe = (value: string | undefined) => {
    if (value) {
      setTabValue(value);
    }
  };
  const setTabStateNoop: Dispatch<SetStateAction<TabContentHandlerState>> =
    () => undefined;

  return (
    <Tabs
      value={tabValue}
      onValueChange={setTabValue}
      data-slide-direction={slideDirection}
      className="page__content-container"
    >
      <TabContent
        index={1}
        name="Elèves"
        leftSide={{ number: 2, title: "Elèves", description: "Assignation" }}
        onClick={({
          e,
          setTabState,
          tabValues,
          index,
          setSlideDirection,
          setTabValue,
          arrayLength,
        }) => {
          const currentStep = e.currentTarget.dataset.name;
          if (currentStep === "next-step" && index < arrayLength - 1) {
            setSlideDirection("right");
            setTabState((prev) => ({
              ...prev,
              isAnimating: false,
              nextIndex: index + 1,
              newTabValue: tabValues[index + 1],
            }));
            setTabValue(tabValues[index + 1]);
          }
        }}
        clickProps={{
          arrayLength: 3,
          setSlideDirection,
          setTabValue: setTabValueSafe,
          setTabState: setTabStateNoop,
          tabValues: ["Classe", "Elèves", "Evaluation"],
        }}
        leftContent={null}
        slideDirection={slideDirection}
        tabValue={tabValue}
      >
        <div>Step Two Content</div>
      </TabContent>
    </Tabs>
  );
}

function getNextButton() {
  const activePanel = document.querySelector<HTMLElement>(
    '[data-slot="tabs-content"][data-state="active"]',
  );

  return activePanel?.querySelector<HTMLButtonElement>(
    'button[aria-label="Next step"]',
  );
}

describe("UI: button 'Suivant' step Elèves", () => {
  const studentId = UUID_SCHEMA.parse("123e4567-e89b-12d3-a456-426614174001");
  const taskId = UUID_SCHEMA.parse("123e4567-e89b-12d3-a456-426614174010");
  const moduleId = UUID_SCHEMA.parse("123e4567-e89b-12d3-a456-426614174100");
  const subSkillId = UUID_SCHEMA.parse("123e4567-e89b-12d3-a456-426614171000");

  beforeEach(() => {
    useEvaluationStepsCreationStore.setState(DEFAULT_VALUES_STEPS_CREATION_STATE);

    const studentsPayload: ClassSummaryDto["students"] = [
      { id: studentId, firstName: "John", lastName: "Stud" },
    ];

    const templates: ClassSummaryDto["templates"] = [
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
    ];

    useEvaluationStepsCreationStore.getState().setStudents(studentsPayload);
    useEvaluationStepsCreationStore.getState().setClassTasks(templates);
    useEvaluationStepsCreationStore
      .getState()
      .setStudentPresence(studentId, true);
  });

  test("active le bouton après assignation de task", async () => {
    await render(
      <AppTestWrapper>
        <EvaluationElevesHarness />
      </AppTestWrapper>,
    );

    expect(getNextButton()).not.toBeNull();
    expect(getNextButton()?.disabled).toBe(true);

    useEvaluationStepsCreationStore
      .getState()
      .setStudentTaskAssignment(taskId, studentId);

    await expect
      .poll(() => useEvaluationStepsCreationStore.getState().areStudentsWithAssignedTasks())
      .toBe(true);

    await expect
      .poll(() => useEvaluationStepsCreationStore.getState().getAttendedModules().length)
      .toBeGreaterThan(0);

    await expect
      .poll(() => getNextButton()?.disabled ?? true)
      .toBe(false);
  });

  test("désactive de nouveau le bouton quand un étudiant assigné passe non présent", async () => {
    await render(
      <AppTestWrapper>
        <EvaluationElevesHarness />
      </AppTestWrapper>,
    );

    useEvaluationStepsCreationStore
      .getState()
      .setStudentTaskAssignment(taskId, studentId);

    await expect
      .poll(() => getNextButton()?.disabled ?? true)
      .toBe(false);

    useEvaluationStepsCreationStore
      .getState()
      .setStudentPresence(studentId, false);

    await expect
      .poll(() => useEvaluationStepsCreationStore.getState().areStudentsWithAssignedTasks())
      .toBe(false);

    await expect
      .poll(() => useEvaluationStepsCreationStore.getState().getAttendedModules().length)
      .toBe(0);

    await expect
      .poll(() => getNextButton()?.disabled ?? false)
      .toBe(true);
  });
});
