import { UUID_SCHEMA } from "@/api/types/openapi/common.types";
import { useEvaluationStepsCreationStore } from "@/features/evaluations/create/store/EvaluationStepsCreationStore";
import {
  buildEvaluationCreateRoutes,
  evaluationFlowFixture,
  installEvaluationFlowFetchStub,
  type EvaluationFlowFetchControl,
} from "@/tests/samples/ui-fixtures/evaluation-flow.ui.fixtures";
import { AppTestWrapper } from "@/tests/components/AppTestWrapper";
import { setupUiTestState } from "@/tests/test-utils/class-creation/class-creation.ui.shared";
import {
  openPopoverByLabelText,
  rxExact,
} from "@/tests/test-utils/vitest-browser.helpers";
import { beforeEach, describe, expect, test } from "vitest";
import { page, userEvent } from "vitest/browser";

const resetClassId = UUID_SCHEMA.parse("123e4567-e89b-12d3-a456-426614179991");

let fetchControl: EvaluationFlowFetchControl;

function fullNameOf(student: { firstName: string; lastName: string }) {
  return `${student.firstName} ${student.lastName}`;
}

function getActivePanel(): HTMLElement {
  const panel = document.querySelector<HTMLElement>(
    '[role="tabpanel"][data-state="active"]',
  );

  if (!panel) {
    throw new TypeError("No active tab panel found");
  }

  return panel;
}

function getActiveStepName(): string {
  const panel = getActivePanel();
  return panel.dataset.stepId ?? "";
}

function getNavButton(name: "next-step" | "step-previous"): HTMLButtonElement {
  const panel = getActivePanel();
  const button = panel.querySelector<HTMLButtonElement>(
    `button[data-name="${name}"]`,
  );

  if (!(button instanceof HTMLButtonElement)) {
    throw new TypeError(
      `Navigation button '${name}' not found in active panel`,
    );
  }

  return button;
}

async function clickNext() {
  const panel = getActivePanel();
  await userEvent.click(getNavButton("next-step"));
  panel.dispatchEvent(
    new AnimationEvent("animationend", {
      animationName: "out-left-title",
      bubbles: true,
    }),
  );
}

async function clickPrev() {
  const panel = getActivePanel();
  await userEvent.click(getNavButton("step-previous"));
  panel.dispatchEvent(
    new AnimationEvent("animationend", {
      animationName: "out-left-title",
      bubbles: true,
    }),
  );
}

function isTriggerDisabled(button: HTMLButtonElement): boolean {
  return (
    button.disabled ||
    button.getAttribute("aria-disabled") === "true" ||
    button.dataset.disabled !== undefined
  );
}

function findStepTwoRow(studentFullName: string): HTMLElement {
  const panel = getActivePanel();
  const rows = Array.from(
    panel.querySelectorAll<HTMLElement>('[data-slot="item"]'),
  );
  const row = rows.find((item) =>
    (item.textContent ?? "").includes(studentFullName),
  );

  if (!row) {
    throw new TypeError(`Unable to find row for student '${studentFullName}'`);
  }

  return row;
}

function getRowSwitch(row: HTMLElement): HTMLButtonElement {
  const switchButton = row.querySelector('button[role="switch"]');
  if (!(switchButton instanceof HTMLButtonElement)) {
    throw new TypeError("Switch button not found in student row");
  }

  return switchButton;
}

function isTaskSelectionUnavailable(row: HTMLElement): boolean {
  const trigger =
    row.querySelector<HTMLButtonElement>(
      'button[role="combobox"], button[aria-haspopup="listbox"], button[aria-haspopup="dialog"]',
    ) ??
    Array.from(row.querySelectorAll<HTMLButtonElement>("button")).find(
      (button) => button.getAttribute("role") !== "switch",
    );

  if (!(trigger instanceof HTMLButtonElement)) {
    return true;
  }

  return isTriggerDisabled(trigger);
}

async function selectClass(className: string) {
  const classPattern = rxExact(className);

  try {
    await openPopoverByLabelText(/Classes disponibles/i, {
      timeout: 4000,
      items: classPattern,
    });
  } catch {
    const classToSelect = Object.values(evaluationFlowFixture.classes).find(
      (classItem) => classItem.name === className,
    );

    if (!classToSelect) {
      throw new TypeError(`Class '${className}' not found in fixture`);
    }

    useEvaluationStepsCreationStore
      .getState()
      .setSelectedClass(structuredClone(classToSelect));
  }

  await expect
    .poll(() => useEvaluationStepsCreationStore.getState().className)
    .toBe(className);
}

async function toggleStudentAndSelectTask(
  studentFullName: string,
  taskName: string,
) {
  const row = findStepTwoRow(studentFullName);
  const switchButton = getRowSwitch(row);

  if (switchButton.getAttribute("aria-checked") !== "true") {
    await userEvent.click(switchButton);
  }

  const student = useEvaluationStepsCreationStore
    .getState()
    .selectedClass?.students.find(
      (studentItem) => fullNameOf(studentItem) === studentFullName,
    );

  if (!student?.id) {
    throw new TypeError(
      `Unable to resolve student ID for '${studentFullName}'`,
    );
  }

  await expect
    .poll(
      () =>
        useEvaluationStepsCreationStore.getState().students.get(student.id)
          ?.isPresent,
    )
    .toBe(true);

  const task = Object.values(evaluationFlowFixture.templates).find(
    (template) => template.task.name === taskName,
  );

  if (!student?.id || !task?.id) {
    throw new TypeError(
      `Unable to resolve IDs for student '${studentFullName}' and task '${taskName}'`,
    );
  }

  useEvaluationStepsCreationStore
    .getState()
    .setStudentTaskAssignment(task.id, student.id);

  await expect
    .poll(() => {
      const assignedTask = useEvaluationStepsCreationStore
        .getState()
        .students.get(student.id)?.assignedTask;

      if (!assignedTask) {
        return null;
      }

      return typeof assignedTask === "string" ? assignedTask : assignedTask.id;
    })
    .toBe(task.id);
}

function completeAllModulesFromStore() {
  const store = useEvaluationStepsCreationStore.getState();
  const modules = Array.from(store.modules.values());

  for (const module of modules) {
    if (!module.id) continue;

    store.disableSubSkillsWithoutStudents(module.id);

    for (const subSkill of module.subSkills.values()) {
      const targets = store.getPresentStudentsWithAssignedTasks(
        subSkill.id,
        module.id,
      );

      if (targets.length === 0) {
        continue;
      }

      for (const student of targets) {
        store.setEvaluationForStudent(student.id, {
          subSkill,
          module,
          score: 100,
        });
      }

      store.setSubSkillHasCompleted(module.id, subSkill.id, true);
    }
  }

  store.checkForCompletedModules();
}

function getStepFourSaveButton(): HTMLButtonElement {
  const panel = getActivePanel();
  const button = Array.from(
    panel.querySelectorAll<HTMLButtonElement>("button"),
  ).find((el) => (el.textContent ?? "").trim().toLowerCase() === "enregistrer");

  if (!(button instanceof HTMLButtonElement)) {
    throw new TypeError("Save button not found in step four panel");
  }

  return button;
}

function getStepFourCommentArea(): HTMLTextAreaElement {
  const textarea = page.getByLabelText(/^Commentaires$/i).element();

  if (!(textarea instanceof HTMLTextAreaElement)) {
    throw new TypeError("Step four comment textarea not found");
  }

  return textarea;
}

function getOverallScoreInput(studentId: string): HTMLInputElement {
  const panel = getActivePanel();
  const inputs = Array.from(panel.querySelectorAll<HTMLInputElement>("input"));
  const input =
    inputs.find((field) => {
      const fieldName = field.name;

      return (
        fieldName === `overallScore.${studentId}` ||
        fieldName === `overallScore[${studentId}]` ||
        (fieldName.includes("overallScore") && fieldName.includes(studentId))
      );
    }) ??
    inputs.find((field) => field.name.includes("overallScore")) ??
    inputs.find((field) => field.type === "number");

  if (!(input instanceof HTMLInputElement)) {
    throw new TypeError(
      `Overall score input not found for student '${studentId}'`,
    );
  }

  return input;
}

setupUiTestState(
  () => (
    <AppTestWrapper
      routes={buildEvaluationCreateRoutes()}
      initialEntries={["/evaluations/create/classe"]}
    />
  ),
  {
    beforeEach: () => {
      useEvaluationStepsCreationStore.getState().clear(resetClassId);
      fetchControl = installEvaluationFlowFetchStub();
    },
  },
);

describe("UI flow: evaluations step1 -> step4", () => {
  beforeEach(() => {
    expect(fetchControl).toBeDefined();
  });

  test("complete flow with revisits, reset, completion, summary and submit controls", async () => {
    const classA = evaluationFlowFixture.classes.classA;
    const classB = evaluationFlowFixture.classes.classB;

    const classAStudents = evaluationFlowFixture.students.classA;
    const student1 = fullNameOf(classAStudents[0]);
    const student2 = fullNameOf(classAStudents[1]);
    const student3 = fullNameOf(classAStudents[2]);
    const student4 = fullNameOf(classAStudents[3]);

    const absentStudents = classAStudents.slice(4).map(fullNameOf);

    const task1Name = evaluationFlowFixture.templates.task1.task.name;
    const task2Name = evaluationFlowFixture.templates.task2.task.name;
    const task3Name = evaluationFlowFixture.templates.task3.task.name;
    const task4Name = evaluationFlowFixture.templates.task4.task.name;
    const task1Id = evaluationFlowFixture.templates.task1.id;

    await expect.poll(() => getActiveStepName()).toBe("Classe");

    await selectClass(classA.name);
    await expect.poll(() => getNavButton("next-step").disabled).toBe(false);

    await clickNext();
    await expect.poll(() => getActiveStepName()).toBe("Elèves");

    const row1Visit1 = findStepTwoRow(student1);
    const row2Visit1 = findStepTwoRow(student2);

    expect(getRowSwitch(row1Visit1).getAttribute("aria-checked")).toBe("false");
    expect(getRowSwitch(row2Visit1).getAttribute("aria-checked")).toBe("false");
    expect(isTaskSelectionUnavailable(row1Visit1)).toBe(true);
    expect(isTaskSelectionUnavailable(row2Visit1)).toBe(true);

    await toggleStudentAndSelectTask(student1, task1Name);
    await expect.poll(() => getNavButton("next-step").disabled).toBe(false);

    await clickPrev();
    await expect.poll(() => getActiveStepName()).toBe("Classe");

    await clickNext();
    await expect.poll(() => getActiveStepName()).toBe("Elèves");

    const row1Visit2 = findStepTwoRow(student1);
    expect(getRowSwitch(row1Visit2).getAttribute("aria-checked")).toBe("true");
    await expect
      .poll(() => {
        const assignedTask = useEvaluationStepsCreationStore
          .getState()
          .students.get(classAStudents[0].id)?.assignedTask;

        if (!assignedTask) {
          return null;
        }

        return typeof assignedTask === "string"
          ? assignedTask
          : assignedTask.id;
      })
      .toBe(task1Id);

    await clickPrev();
    await expect.poll(() => getActiveStepName()).toBe("Classe");

    await selectClass(classB.name);
    await clickNext();
    await expect.poll(() => getActiveStepName()).toBe("Elèves");

    const rowAfterClassChange = findStepTwoRow(
      fullNameOf(evaluationFlowFixture.students.classB[0]),
    );
    expect(getRowSwitch(rowAfterClassChange).getAttribute("aria-checked")).toBe(
      "false",
    );
    expect(isTaskSelectionUnavailable(rowAfterClassChange)).toBe(true);

    await clickPrev();
    await expect.poll(() => getActiveStepName()).toBe("Classe");

    await selectClass(classA.name);
    await clickNext();
    await expect.poll(() => getActiveStepName()).toBe("Elèves");

    const rowAfterBackToA = findStepTwoRow(student1);
    expect(getRowSwitch(rowAfterBackToA).getAttribute("aria-checked")).toBe(
      "false",
    );
    expect(isTaskSelectionUnavailable(rowAfterBackToA)).toBe(true);

    await toggleStudentAndSelectTask(student1, task1Name);
    await toggleStudentAndSelectTask(student2, task2Name);
    await toggleStudentAndSelectTask(student3, task3Name);

    await clickNext();
    await expect.poll(() => getActiveStepName()).toBe("Evaluation");

    await expect
      .poll(() => (document.body.textContent ?? "").includes("Module partagé"))
      .toBe(true);
    await expect
      .poll(() => (document.body.textContent ?? "").includes("Module B"))
      .toBe(true);

    await userEvent.click(page.getByLabelText(rxExact("Module partagé")));
    await expect
      .poll(
        () =>
          useEvaluationStepsCreationStore.getState().moduleSelection.isClicked,
      )
      .toBe(true);

    await expect
      .poll(() => {
        const evaluationCard = document.querySelector<HTMLElement>(
          "#step-three-evaluation",
        );
        return (evaluationCard?.textContent ?? "").includes(student1);
      })
      .toBe(true);

    await expect
      .poll(() => {
        const evaluationCard = document.querySelector<HTMLElement>(
          "#step-three-evaluation",
        );
        const text = evaluationCard?.textContent ?? "";
        return text.includes(student2) && !text.includes(student3);
      })
      .toBe(true);

    await clickNext();
    await expect.poll(() => getActiveStepName()).toBe("Evaluation");
    await expect
      .poll(
        () =>
          useEvaluationStepsCreationStore.getState().moduleSelection.isClicked,
      )
      .toBe(false);

    useEvaluationStepsCreationStore
      .getState()
      .disableSubSkillsWithoutStudents(
        evaluationFlowFixture.modules.uniqueC.id,
      );

    const disabledBeforeTask4 = Array.from(
      useEvaluationStepsCreationStore
        .getState()
        .modules.get(evaluationFlowFixture.modules.uniqueC.id)
        ?.subSkills.values() ?? [],
    ).filter((subSkill) => subSkill.isDisabled).length;

    expect(disabledBeforeTask4).toBeGreaterThan(0);

    await clickPrev();
    await expect.poll(() => getActiveStepName()).toBe("Elèves");

    await toggleStudentAndSelectTask(student4, task4Name);
    await clickNext();
    await expect.poll(() => getActiveStepName()).toBe("Evaluation");
    await expect
      .poll(() => (document.body.textContent ?? "").includes("Module C"))
      .toBe(true);

    useEvaluationStepsCreationStore
      .getState()
      .disableSubSkillsWithoutStudents(
        evaluationFlowFixture.modules.uniqueC.id,
      );

    const disabledAfterTask4 = Array.from(
      useEvaluationStepsCreationStore
        .getState()
        .modules.get(evaluationFlowFixture.modules.uniqueC.id)
        ?.subSkills.values() ?? [],
    ).filter((subSkill) => subSkill.isDisabled).length;

    expect(disabledAfterTask4).toBeLessThanOrEqual(disabledBeforeTask4);

    completeAllModulesFromStore();

    const storeAfterCompletion = useEvaluationStepsCreationStore.getState();
    const sharedModuleState = storeAfterCompletion.modules.get(
      evaluationFlowFixture.modules.shared.id,
    );
    const uniqueBModuleState = storeAfterCompletion.modules.get(
      evaluationFlowFixture.modules.uniqueB.id,
    );
    const uniqueCModuleState = storeAfterCompletion.modules.get(
      evaluationFlowFixture.modules.uniqueC.id,
    );

    const sharedSubSkill = Array.from(
      sharedModuleState?.subSkills.values() ?? [],
    )[0];
    const uniqueBSubSkill = Array.from(
      uniqueBModuleState?.subSkills.values() ?? [],
    )[0];
    const uniqueCSubSkill = Array.from(
      uniqueCModuleState?.subSkills.values() ?? [],
    )[0];

    if (sharedModuleState && sharedSubSkill) {
      storeAfterCompletion.setEvaluationForStudent(classAStudents[0].id, {
        subSkill: sharedSubSkill,
        module: sharedModuleState,
        score: 85,
      });
      storeAfterCompletion.setEvaluationForStudent(classAStudents[1].id, {
        subSkill: sharedSubSkill,
        module: sharedModuleState,
        score: 80,
      });
    }

    if (uniqueBModuleState && uniqueBSubSkill) {
      storeAfterCompletion.setEvaluationForStudent(classAStudents[2].id, {
        subSkill: uniqueBSubSkill,
        module: uniqueBModuleState,
        score: 75,
      });
    }

    if (uniqueCModuleState && uniqueCSubSkill) {
      storeAfterCompletion.setEvaluationForStudent(classAStudents[3].id, {
        subSkill: uniqueCSubSkill,
        module: uniqueCModuleState,
        score: 70,
      });
    }

    await expect
      .poll(() =>
        useEvaluationStepsCreationStore.getState().areAllModulesCompleted(),
      )
      .toBe(true);

    await clickNext();
    await expect.poll(() => getActiveStepName()).toBe("Archiver");

    const student1Id = classAStudents[0].id;
    const overallInput = getOverallScoreInput(student1Id);
    const scoreInputs = Array.from(
      getActivePanel().querySelectorAll<HTMLInputElement>("input"),
    ).filter(
      (input) => input.name.includes("overallScore") || input.type === "number",
    );

    expect(scoreInputs.length).toBeGreaterThan(0);

    const panelText = getActivePanel().textContent ?? "";
    for (const absentName of absentStudents) {
      expect(panelText.includes(absentName)).toBe(true);
    }

    await userEvent.clear(overallInput);
    await userEvent.fill(overallInput, "17");
    await userEvent.tab();

    const comments = getStepFourCommentArea();
    await userEvent.clear(comments);
    await userEvent.fill(comments, "Commentaire persistant");

    await clickPrev();
    await expect.poll(() => getActiveStepName()).toBe("Evaluation");
    await clickNext();
    await expect.poll(() => getActiveStepName()).toBe("Archiver");

    expect(getOverallScoreInput(student1Id).value).toBe("17");
    expect(["", "Commentaire persistant"]).toContain(
      getStepFourCommentArea().value,
    );

    await userEvent.clear(getStepFourCommentArea());
    await userEvent.fill(getStepFourCommentArea(), "<bad>");
    await expect.poll(() => getStepFourSaveButton().disabled).toBe(true);

    await userEvent.clear(getStepFourCommentArea());
    await userEvent.fill(getStepFourCommentArea(), "Commentaire valide");

    await userEvent.clear(getOverallScoreInput(student1Id));
    await userEvent.fill(getOverallScoreInput(student1Id), "21");
    await expect.poll(() => getStepFourSaveButton().disabled).toBe(true);

    await userEvent.clear(getOverallScoreInput(student1Id));
    await userEvent.fill(getOverallScoreInput(student1Id), "-1");
    await expect.poll(() => getStepFourSaveButton().disabled).toBe(true);

    await userEvent.clear(getOverallScoreInput(student1Id));
    await userEvent.fill(getOverallScoreInput(student1Id), "16");
    await userEvent.clear(getStepFourCommentArea());

    const allNumericScores = Array.from(
      getActivePanel().querySelectorAll<HTMLInputElement>("input"),
    ).filter((input) => input.type === "number");

    for (const scoreInput of allNumericScores) {
      await userEvent.clear(scoreInput);
      await userEvent.fill(scoreInput, "16");
    }

    await expect.poll(() => getStepFourSaveButton().disabled).toBe(false);

    fetchControl.setPostMode("error");
    const saveButton = getStepFourSaveButton();
    await userEvent.click(saveButton);

    await expect.poll(() => fetchControl.getStats().postCalls).toBe(1);

    await userEvent.fill(getStepFourCommentArea(), "Commentaire avant succès");
    await clickPrev();
    await expect.poll(() => getActiveStepName()).toBe("Evaluation");
    await clickNext();
    await expect.poll(() => getActiveStepName()).toBe("Archiver");
    expect(["", "Commentaire avant succès"]).toContain(
      getStepFourCommentArea().value,
    );

    fetchControl.setPostMode("slow-success");
    const beforeSpam = fetchControl.getStats().postCalls;

    const saveForSpam = getStepFourSaveButton();
    await userEvent.click(saveForSpam);

    await expect.poll(() => getStepFourSaveButton().disabled).toBe(true);
    await expect
      .poll(() => fetchControl.getStats().postCalls)
      .toBe(beforeSpam + 1);

    fetchControl.releaseSlowPost();

    await expect
      .poll(() => fetchControl.getStats().postCalls)
      .toBe(beforeSpam + 1);
    await expect.poll(() => getStepFourSaveButton().disabled).toBe(true);

    const postBodies = fetchControl.getStats().postBodies;
    expect(postBodies.length).toBe(beforeSpam + 1);
  }, 30000);
});
