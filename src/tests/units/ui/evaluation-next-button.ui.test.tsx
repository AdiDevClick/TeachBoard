import { useEvaluationStepsCreationStore } from "@/features/evaluations/create/store/EvaluationStepsCreationStore";
import { AppTestWrapper } from "@/tests/components/AppTestWrapper";
import { EvaluationNextStepTestButton } from "@/tests/components/evaluations/EvaluationNextStepButton";
import { getEvaluationStepClassSummaryFixture } from "@/tests/samples/ui-fixtures/evaluation-next-step.ui.fixtures";

import { setupUiTestState } from "@/tests/test-utils/class-creation/class-creation.ui.shared";
import {
  getNextStepTestButton,
  getPreviousStepTestButton,
} from "@/tests/test-utils/evaluation-steps/evaluation-steps.functions";
import { beforeEach, describe, expect, test } from "vitest";

/**
 * Make sure the evaluation flow is currently showing the "Elèves" panel.
 * On first render the correct tab should already be active (we navigate
 * directly to it via initialEntries) but some asynchronous effects can
 * briefly render the previous panel so we poll and optionally traverse.
 */

const { selectedClass, studentId, taskId, moduleId, resetClassId } =
  getEvaluationStepClassSummaryFixture();

setupUiTestState(
  () => {
    return (
      <AppTestWrapper>
        <EvaluationNextStepTestButton name="Elèves" index={1} />
      </AppTestWrapper>
    );
  },
  {
    beforeEach: () => {
      useEvaluationStepsCreationStore.getState().clear(resetClassId);

      useEvaluationStepsCreationStore
        .getState()
        .setSelectedClass(structuredClone(selectedClass));
      useEvaluationStepsCreationStore
        .getState()
        .setStudentPresence(studentId, true);
    },
  },
);

describe("UI: button 'Suivant' step Elèves", () => {
  test("active le bouton après assignation de task", async () => {
    await expect
      .poll(() => getNextStepTestButton() != null, { timeout: 2000 })
      .toBe(true);

    expect(getNextStepTestButton()).not.toBeNull();
    await expect
      .poll(() => getNextStepTestButton()?.disabled ?? false)
      .toBe(true);

    useEvaluationStepsCreationStore
      .getState()
      .setStudentTaskAssignment(taskId, studentId);

    await expect
      .poll(() =>
        useEvaluationStepsCreationStore
          .getState()
          .areStudentsWithAssignedTasks(),
      )
      .toBe(true);

    await expect
      .poll(
        () =>
          useEvaluationStepsCreationStore.getState().getAttendedModules()
            .length,
      )
      .toBeGreaterThan(0);

    await expect
      .poll(() => getNextStepTestButton()?.disabled ?? true)
      .toBe(false);
  });

  test("désactive de nouveau le bouton quand un étudiant assigné passe non présent", async () => {
    await expect
      .poll(() => getNextStepTestButton() != null, { timeout: 2000 })
      .toBe(true);

    useEvaluationStepsCreationStore
      .getState()
      .setStudentTaskAssignment(taskId, studentId);

    await expect
      .poll(() => getNextStepTestButton()?.disabled ?? true)
      .toBe(false);

    useEvaluationStepsCreationStore
      .getState()
      .setStudentPresence(studentId, false);

    await expect
      .poll(() =>
        useEvaluationStepsCreationStore
          .getState()
          .areStudentsWithAssignedTasks(),
      )
      .toBe(false);

    await expect
      .poll(
        () =>
          useEvaluationStepsCreationStore.getState().getAttendedModules()
            .length,
      )
      .toBe(0);

    await expect
      .poll(() => getNextStepTestButton()?.disabled ?? false)
      .toBe(true);
  });

  test("réactive le bouton quand un étudiant assigné redevient présent sans réassigner la task", async () => {
    await expect
      .poll(() => getNextStepTestButton() != null, { timeout: 2000 })
      .toBe(true);

    // assign task -> Next enabled
    useEvaluationStepsCreationStore
      .getState()
      .setStudentTaskAssignment(taskId, studentId);

    await expect
      .poll(() => getNextStepTestButton()?.disabled ?? true)
      .toBe(false);

    // set presence false -> Next disabled
    useEvaluationStepsCreationStore
      .getState()
      .setStudentPresence(studentId, false);

    await expect
      .poll(() => getNextStepTestButton()?.disabled ?? false)
      .toBe(true);

    // set presence true again without changing the task -> Next should re-enable
    useEvaluationStepsCreationStore
      .getState()
      .setStudentPresence(studentId, true);

    await expect
      .poll(() =>
        useEvaluationStepsCreationStore
          .getState()
          .areStudentsWithAssignedTasks(),
      )
      .toBe(true);

    await expect
      .poll(
        () =>
          useEvaluationStepsCreationStore.getState().getAttendedModules()
            .length,
      )
      .toBeGreaterThan(0);

    await expect
      .poll(() => getNextStepTestButton()?.disabled ?? true)
      .toBe(false);
  });
});

describe("UI: next/prev states on other steps", () => {
  beforeEach(async () => {
    await cleanup();

    const store = useEvaluationStepsCreationStore.getState();
    store.clear(resetClassId);
    store.setSelectedClass(structuredClone(selectedClass));
    store.setStudentPresence(studentId, true);
    store.setStudentTaskAssignment(taskId, studentId);
  });

  test("step 1: next enabled, prev disabled", async () => {
    // mount button component on step1
    await render(
      <AppTestWrapper>
        <EvaluationNextStepTestButton name="Classe" index={0} />
      </AppTestWrapper>,
    );

    await expect.poll(() => getNextStepTestButton() != null).toBe(true);
    expect(getPreviousStepTestButton()).not.toBeNull();

    // selectedClass is now present, so Next should be enabled
    await expect
      .poll(() => getNextStepTestButton()?.disabled ?? true)
      .toBe(false);
    // no previous step exists
    await expect
      .poll(() => getPreviousStepTestButton()?.disabled ?? false)
      .toBe(true);
  });

  test("step 3: previous enabled, next toggles with moduleSelection", async () => {
    await render(
      <AppTestWrapper>
        <EvaluationNextStepTestButton name="Evaluation" index={2} />
      </AppTestWrapper>,
    );

    await expect.poll(() => getNextStepTestButton() != null).toBe(true);
    expect(getPreviousStepTestButton()).not.toBeNull();

    // before clicking modules, next should be disabled (due to attended
    // module present but not yet clicked)
    await expect
      .poll(() => getNextStepTestButton()?.disabled ?? false)
      .toBe(true);
    await expect
      .poll(() => getPreviousStepTestButton()?.disabled ?? false)
      .toBe(false);

    // simulate module click state – use the full setter to guarantee the
    // moduleSelection object reference changes (see store fix)
    useEvaluationStepsCreationStore.getState().setModuleSelection({
      isClicked: true,
      selectedModuleIndex: 0,
      selectedModuleId: moduleId,
    });

    await expect
      .poll(() => getNextStepTestButton()?.disabled ?? true)
      .toBe(false);
  });

  test("step 4: previous enabled, next always disabled", async () => {
    await render(
      <AppTestWrapper>
        <EvaluationNextStepTestButton name="Archiver" index={3} />
      </AppTestWrapper>,
    );

    await expect.poll(() => getNextStepTestButton() != null).toBe(true);
    expect(getPreviousStepTestButton()).not.toBeNull();

    await expect
      .poll(() => getNextStepTestButton()?.disabled ?? false)
      .toBe(true);
    await expect
      .poll(() => getPreviousStepTestButton()?.disabled ?? false)
      .toBe(false);
  });
});
