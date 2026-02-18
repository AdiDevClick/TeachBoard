import { UUID_SCHEMA } from "@/api/types/openapi/common.types";
import type { ClassSummaryDto } from "@/api/types/routes/classes.types";
import {
  useEvaluationStepsCreationStore,
} from "@/features/evaluations/create/store/EvaluationStepsCreationStore";
import { ROUTES_CHILDREN } from "@/routes/routes.config";
import { AppTestWrapper } from "@/tests/components/AppTestWrapper";
import { setupUiTestState } from "@/tests/test-utils/class-creation/class-creation.ui.shared";
import { describe, expect, test } from "vitest";
import { page } from "vitest/browser";

function getNextButton() {
  const stepTwoPanelButton = document.querySelector<HTMLButtonElement>(
    '#tab-content-1 button[aria-label="Next step"]',
  );

  if (stepTwoPanelButton) {
    return stepTwoPanelButton;
  }

  const activePanel = document.querySelector<HTMLElement>(
    '[data-slot="tabs-content"][data-state="active"]',
  );

  return activePanel?.querySelector<HTMLButtonElement>(
    'button[aria-label="Next step"]',
  );
}

async function ensureElevesTabReady() {
  await expect.poll(() => getNextButton() != null).toBe(true);

  const elevesTitle = page.getByText(/El.ves présents/i);

  if (!elevesTitle.query()) {
    const nextButton = getNextButton();

    if (nextButton) {
      nextButton.click();
    }
  }

  await expect.poll(() => elevesTitle.query() != null).toBe(true);
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
      <AppTestWrapper
        routes={ROUTES_CHILDREN}
        initialEntries={["/evaluations/create/Elèves"]}
      />
    );
  },
  {
    beforeEach: () => {
      useEvaluationStepsCreationStore.getState().clear(resetClassId);

      useEvaluationStepsCreationStore.getState().setSelectedClass(selectedClass);
      useEvaluationStepsCreationStore
        .getState()
        .setStudentPresence(studentId, true);
    },
  },
);

describe("UI: button 'Suivant' step Elèves", () => {
  test("active le bouton après assignation de task", async () => {
    await ensureElevesTabReady();

    expect(getNextButton()).not.toBeNull();
    expect(getNextButton()?.disabled).toBe(true);

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
    await ensureElevesTabReady();

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
    await ensureElevesTabReady();

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
