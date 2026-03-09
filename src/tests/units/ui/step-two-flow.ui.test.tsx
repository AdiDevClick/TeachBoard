import { UUID_SCHEMA } from "@/api/types/openapi/common.types";
import type { ClassSummaryDto } from "@/api/types/routes/classes.types";
import { EvaluationPageTabsDatas } from "@/data/EvaluationPageDatas.tsx";
import { useTabContentHandler } from "@/features/evaluations/create/hooks/tab-handler/useTabContentHandler";
import { StepTwo } from "@/features/evaluations/create/steps/two/StepTwo";
import { useEvaluationStepsCreationStore } from "@/features/evaluations/create/store/EvaluationStepsCreationStore";
import { AppTestWrapper } from "@/tests/components/AppTestWrapper";
import { beforeEach, describe, expect, test } from "vitest";
import { page, userEvent } from "vitest/browser";

function TestNextButton({
  name,
  index,
}: Readonly<{ name: string; index: number }>) {
  const { tabState } = useTabContentHandler({
    name,
    onClick: () => {},
    clickProps: {
      arrayLength: Object.keys(EvaluationPageTabsDatas).length,
      setSlideDirection: () => {},
      setTabValue: () => {},
      setTabState: () => {},
      tabValues: Object.values(EvaluationPageTabsDatas).map((d) => d.name),
    },
    index,
  });

  return (
    <button
      aria-label="Next step"
      data-name="next-step"
      disabled={tabState.isNextDisabled}
    />
  );
}

function getNextButton() {
  return document.querySelector<HTMLButtonElement>(
    'button[data-name="next-step"]',
  );
}

/** Returns the switch inside the AllOnSwitch (the first [data-slot="item"] directly in the form). */
function getAllOnSwitch(): HTMLButtonElement | null {
  const firstItem = document.querySelector<HTMLElement>('[data-slot="item"]');
  return (
    firstItem?.querySelector<HTMLButtonElement>('button[role="switch"]') ?? null
  );
}

/** Returns the first student-row switch (button[role="switch"] inside a data-slot="field" row). */
function getStudentRowSwitch(): HTMLButtonElement | null {
  // Student rows are wrapped by withController which renders a [data-slot="field"] container;
  // the AllOnSwitch has no such wrapper, so this picks up only student switches.
  const studentField = document.querySelector<HTMLElement>(
    '[data-slot="field"]',
  );
  return (
    studentField?.querySelector<HTMLButtonElement>('button[role="switch"]') ??
    null
  );
}

const studentId = UUID_SCHEMA.parse("123e4567-e89b-12d3-a456-426614174001");
const taskId = UUID_SCHEMA.parse("123e4567-e89b-12d3-a456-426614174010");
const moduleId = UUID_SCHEMA.parse("123e4567-e89b-12d3-a456-426614174100");
const subSkillId = UUID_SCHEMA.parse("123e4567-e89b-12d3-a456-426614171000");
const resetClassId = UUID_SCHEMA.parse("123e4567-e89b-12d3-a456-426614179999");

const selectedClass: ClassSummaryDto = {
  id: UUID_SCHEMA.parse("123e4567-e89b-12d3-a456-426614174050"),
  name: "Classe test",
  description: "Classe pour test UI step 2",
  degreeConfigName: "CAP Cuisine 2A",
  degreeLevel: "CAP",
  degreeYearCode: "2A",
  degreeYearName: "Deuxième année",
  evaluations: [],
  students: [{ id: studentId, firstName: "John", lastName: "Stud" }],
  templates: [
    {
      id: taskId,
      taskName: "Task 1",
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

describe("UI: StepTwo flow regression", () => {
  beforeEach(() => {
    useEvaluationStepsCreationStore.getState().clear(resetClassId);
    useEvaluationStepsCreationStore.getState().setSelectedClass(selectedClass);
  });

  test("switch + task selection persists and enables next", async () => {
    await render(
      <AppTestWrapper>
        <StepTwo />
        <TestNextButton name="Elèves" index={1} />
      </AppTestWrapper>,
    );

    await expect.poll(() => getNextButton() != null).toBe(true);
    await expect.poll(() => getNextButton()?.disabled ?? false).toBe(true);

    await expect.poll(() => getStudentRowSwitch() != null).toBe(true);
    await userEvent.click(getStudentRowSwitch()!);

    await expect
      .poll(
        () =>
          useEvaluationStepsCreationStore.getState().students.get(studentId)
            ?.isPresent,
      )
      .toBe(true);

    const taskTrigger = page.getByRole("button", {
      name: /Sélectionnez une tâche/i,
    });

    await userEvent.click(taskTrigger);
    await userEvent.click(page.getByRole("option", { name: /Task 1/i }));

    await expect
      .poll(() =>
        useEvaluationStepsCreationStore
          .getState()
          .areStudentsWithAssignedTasks(),
      )
      .toBe(true);

    await expect.poll(() => getNextButton()?.disabled ?? true).toBe(false);

    await cleanup();

    await render(
      <AppTestWrapper>
        <StepTwo />
        <TestNextButton name="Elèves" index={1} />
      </AppTestWrapper>,
    );

    const switchAfterRemount = getStudentRowSwitch();
    expect(switchAfterRemount?.getAttribute("aria-checked")).toBe("true");
    await expect.poll(() => getNextButton()?.disabled ?? true).toBe(false);
  });

  test("‘Tous’ toggle updates store and child switches immediately", async () => {
    await render(
      <AppTestWrapper>
        <StepTwo />
      </AppTestWrapper>,
    );

    const allSwitch = getAllOnSwitch();
    expect(allSwitch?.getAttribute("aria-checked")).toBe("false");

    await userEvent.click(allSwitch!);

    await expect
      .poll(() => useEvaluationStepsCreationStore.getState().allPresent)
      .toBe(true);

    // re‑query student switch after state update and re‑render
    await expect
      .poll(() => getStudentRowSwitch()?.getAttribute("aria-checked"))
      .toBe("true");
  });
});
