import { UUID_SCHEMA } from "@/api/types/openapi/common.types";
import type { ClassSummaryDto } from "@/api/types/routes/classes.types";
import { useTabContentHandler } from "@/features/evaluations/create/hooks/tab-handler/useTabContentHandler";
import { useEvaluationStepsCreationStore } from "@/features/evaluations/create/store/EvaluationStepsCreationStore";
import { EvaluationPageTabsDatas } from "@/data/EvaluationPageDatas.tsx";
import { AppTestWrapper } from "@/tests/components/AppTestWrapper";
import { setupUiTestState } from "@/tests/test-utils/class-creation/class-creation.ui.shared";
import { describe, expect, test } from "vitest";

// helpers that query the currently visible tab content rather than relying
// on hard‑coded indices. the `data-name` attributes are guaranteed by
// `TabContent` and are more stable than looking at ids or relying on
// `aria-label` alone.
function getNextButton() {
  return document.querySelector<HTMLButtonElement>(
    'button[data-name="next-step"]',
  );
}

/**
 * Make sure the evaluation flow is currently showing the "Elèves" panel.
 * On first render the correct tab should already be active (we navigate
 * directly to it via initialEntries) but some asynchronous effects can
 * briefly render the previous panel so we poll and optionally traverse.
 */
// navigation helper removed – tests now use a dedicated component

// helper component that exposes Next button state via the real hook
function TestNextButton() {
  const { tabState } = useTabContentHandler({
    name: "Elèves",
    onClick: () => {},
    clickProps: {
      arrayLength: Object.keys(EvaluationPageTabsDatas).length,
      setSlideDirection: () => {},
      setTabValue: () => {},
      setTabState: () => {},
      tabValues: Object.values(EvaluationPageTabsDatas).map((d) => d.name),
    },
    index: 1,
  });

  return (
    <button
      aria-label="Next step"
      data-name="next-step"
      disabled={tabState.isNextDisabled}
    />
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
        <TestNextButton />
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
