import { StepTwo } from "@/features/evaluations/create/steps/two/StepTwo";
import { useEvaluationStepsCreationStore } from "@/features/evaluations/create/store/EvaluationStepsCreationStore";
import { AppTestWrapper } from "@/tests/components/AppTestWrapper";
import { EvaluationNextStepTestButton } from "@/tests/components/evaluations/EvaluationNextStepButton";
import { getEvaluationStepClassSummaryFixture } from "@/tests/samples/ui-fixtures/evaluation-next-step.ui.fixtures";
import { getNextStepTestButton } from "@/tests/test-utils/evaluation-steps/evaluation-steps.functions";
import { beforeEach, describe, expect, test } from "vitest";
import { page, userEvent } from "vitest/browser";

const getNextButton = getNextStepTestButton;

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

const { selectedClass, studentId, resetClassId } =
  getEvaluationStepClassSummaryFixture();

describe("UI: StepTwo flow regression", () => {
  beforeEach(() => {
    useEvaluationStepsCreationStore.getState().clear(resetClassId);
    useEvaluationStepsCreationStore
      .getState()
      .setSelectedClass(structuredClone(selectedClass));
  });

  test("switch + task selection persists and enables next", async () => {
    await render(
      <AppTestWrapper>
        <StepTwo />
        <EvaluationNextStepTestButton
          name="Elèves"
          index={1}
          showPrevious={false}
        />
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
        <EvaluationNextStepTestButton
          name="Elèves"
          index={1}
          showPrevious={false}
        />
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
