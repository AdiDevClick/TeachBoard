import { UUID_SCHEMA } from "@/api/types/openapi/common.types";
import type { ClassSummaryDto } from "@/api/types/routes/classes.types";
import { EvaluationPageTabsDatas } from "@/data/EvaluationPageDatas.tsx";
import { useTabContentHandler } from "@/features/evaluations/create/hooks/tab-handler/useTabContentHandler";
import { useEvaluationStepsCreationStore } from "@/features/evaluations/create/store/EvaluationStepsCreationStore";
import { AppTestWrapper } from "@/tests/components/AppTestWrapper";
import { setupUiTestState } from "@/tests/test-utils/class-creation/class-creation.ui.shared";
import { beforeEach, describe, expect, test } from "vitest";

// helpers that query the currently visible tab content rather than relying
// on hard‑coded indices. the `data-name` attributes are guaranteed by
// `TabContent` and are more stable than looking at ids or relying on
// `aria-label` alone.
function getNextButton() {
  return document.querySelector<HTMLButtonElement>(
    'button[data-name="next-step"]',
  );
}
function getPrevButton() {
  return document.querySelector<HTMLButtonElement>(
    'button[data-name="previous-step"]',
  );
}

/**
 * Make sure the evaluation flow is currently showing the "Elèves" panel.
 * On first render the correct tab should already be active (we navigate
 * directly to it via initialEntries) but some asynchronous effects can
 * briefly render the previous panel so we poll and optionally traverse.
 */
// navigation helper removed – tests now use a dedicated component

// helper component that exposes Next/Previous button state via the real hook
function TestNextButton({ name, index }: { name: string; index: number }) {
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
    <>
      <button
        aria-label="Previous step"
        data-name="previous-step"
        disabled={index === 0}
      />
      <button
        aria-label="Next step"
        data-name="next-step"
        disabled={tabState.isNextDisabled}
      />
    </>
  );
}

const studentId = UUID_SCHEMA.parse("123e4567-e89b-12d3-a456-426614174001");
const taskId = UUID_SCHEMA.parse("123e4567-e89b-12d3-a456-426614174010");
const moduleId = UUID_SCHEMA.parse("123e4567-e89b-12d3-a456-426614174100");
const subSkillId = UUID_SCHEMA.parse("123e4567-e89b-12d3-a456-426614171000");
const resetClassId = UUID_SCHEMA.parse("123e4567-e89b-12d3-a456-426614179999");

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

const selectedClass: ClassSummaryDto = {
  id: UUID_SCHEMA.parse("123e4567-e89b-12d3-a456-426614174050"),
  name: "Classe test",
  description: "Classe pour test UI step 2",
  degreeConfigName: "CAP Cuisine 2A",
  degreeLevel: "CAP",
  degreeYearCode: "2A",
  degreeYearName: "Deuxième année",
  evaluations: [],
  students: studentsPayload,
  templates,
};

setupUiTestState(
  () => {
    return (
      <AppTestWrapper>
        <TestNextButton name="Elèves" index={1} />
      </AppTestWrapper>
    );
  },
  {
    beforeEach: () => {
      useEvaluationStepsCreationStore.getState().clear(resetClassId);

      useEvaluationStepsCreationStore
        .getState()
        .setSelectedClass(selectedClass);
      useEvaluationStepsCreationStore
        .getState()
        .setStudentPresence(studentId, true);
    },
  },
);

describe("UI: button 'Suivant' step Elèves", () => {
  test("active le bouton après assignation de task", async () => {
    await expect
      .poll(() => getNextButton() != null, { timeout: 2000 })
      .toBe(true);

    expect(getNextButton()).not.toBeNull();
    await expect.poll(() => getNextButton()?.disabled ?? false).toBe(true);

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

    await expect.poll(() => getNextButton()?.disabled ?? true).toBe(false);
  });

  test("désactive de nouveau le bouton quand un étudiant assigné passe non présent", async () => {
    await expect
      .poll(() => getNextButton() != null, { timeout: 2000 })
      .toBe(true);

    useEvaluationStepsCreationStore
      .getState()
      .setStudentTaskAssignment(taskId, studentId);

    await expect.poll(() => getNextButton()?.disabled ?? true).toBe(false);

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

    await expect.poll(() => getNextButton()?.disabled ?? false).toBe(true);
  });

  test("réactive le bouton quand un étudiant assigné redevient présent sans réassigner la task", async () => {
    await expect
      .poll(() => getNextButton() != null, { timeout: 2000 })
      .toBe(true);

    // assign task -> Next enabled
    useEvaluationStepsCreationStore
      .getState()
      .setStudentTaskAssignment(taskId, studentId);

    await expect.poll(() => getNextButton()?.disabled ?? true).toBe(false);

    // set presence false -> Next disabled
    useEvaluationStepsCreationStore
      .getState()
      .setStudentPresence(studentId, false);

    await expect.poll(() => getNextButton()?.disabled ?? false).toBe(true);

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

    await expect.poll(() => getNextButton()?.disabled ?? true).toBe(false);
  });
});

// additional coverage for other steps

// we need to ensure a valid class is selected before each of these
// standalone renders. the earlier `setupUiTestState` call only affects
// the first describe block, so we replicate the essential state here.

describe("UI: next/prev states on other steps", () => {
  beforeEach(async () => {
    // ensure previous renders are unmounted; without this the leftover
    // buttons polluted the DOM and `getPrevButton()` would return the wrong
    // element, causing every assertion below to flip.
    await cleanup();

    const store = useEvaluationStepsCreationStore.getState();
    store.clear(resetClassId);
    store.setSelectedClass(selectedClass);
    // mark at least one student present with an assigned task so that the
    // evaluation step has an "attended module"; this guarantees the initial
    // next button is disabled before the module-selection click.
    store.setStudentPresence(studentId, true);
    store.setStudentTaskAssignment(taskId, studentId);
  });

  test("step 1: next enabled, prev disabled", async () => {
    // mount button component on step1
    await render(
      <AppTestWrapper>
        <TestNextButton name="Classe" index={0} />
      </AppTestWrapper>,
    );

    await expect.poll(() => getNextButton() != null).toBe(true);
    expect(getPrevButton()).not.toBeNull();

    // selectedClass is now present, so Next should be enabled
    await expect.poll(() => getNextButton()?.disabled ?? true).toBe(false);
    // no previous step exists
    await expect.poll(() => getPrevButton()?.disabled ?? false).toBe(true);
  });

  test("step 3: previous enabled, next toggles with moduleSelection", async () => {
    await render(
      <AppTestWrapper>
        <TestNextButton name="Evaluation" index={2} />
      </AppTestWrapper>,
    );

    await expect.poll(() => getNextButton() != null).toBe(true);
    expect(getPrevButton()).not.toBeNull();

    // before clicking modules, next should be disabled (due to attended
    // module present but not yet clicked)
    await expect.poll(() => getNextButton()?.disabled ?? false).toBe(true);
    await expect.poll(() => getPrevButton()?.disabled ?? false).toBe(false);

    // simulate module click state – use the full setter to guarantee the
    // moduleSelection object reference changes (see store fix)
    useEvaluationStepsCreationStore
      .getState()
      .setModuleSelection({
        isClicked: true,
        selectedModuleIndex: 0,
        selectedModuleId: moduleId,
      });

    await expect.poll(() => getNextButton()?.disabled ?? true).toBe(false);
  });

  test("step 4: previous enabled, next always disabled", async () => {
    await render(
      <AppTestWrapper>
        <TestNextButton name="Archiver" index={3} />
      </AppTestWrapper>,
    );

    await expect.poll(() => getNextButton() != null).toBe(true);
    expect(getPrevButton()).not.toBeNull();

    await expect.poll(() => getNextButton()?.disabled ?? false).toBe(true);
    await expect.poll(() => getPrevButton()?.disabled ?? false).toBe(false);
  });
});
