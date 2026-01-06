import { taskTemplateCreationInputControllers } from "@/data/inputs-controllers.data";
import { AppModals } from "@/pages/AllModals/AppModals";
import { AppTestWrapper } from "@/tests/components/AppTestWrapper";
import { SamplePopoverInput } from "@/tests/components/class-creation/SamplePopoverInput";
import {
  classCreated,
  classFetched,
  classFetched2,
  diplomaFetched,
  diplomaFetched2,
  studentFetched,
  taskFetched,
  taskFetched2,
} from "@/tests/samples/class-creation-sample-datas";
import { fixtureCreateClassStepOne } from "@/tests/samples/ui-fixtures/class-creation.ui.fixtures";
import { setupUiTestState } from "@/tests/test-utils/class-creation/class-creation.ui.shared";
import {
  controllerLabelRegex,
  controllerTriggerRegex,
} from "@/tests/test-utils/class-creation/regex.functions";
import {
  assertPostUpdatedCacheWithoutExtraGet,
  waitForCache,
} from "@/tests/test-utils/tests.functions";
import {
  clickControlByLabelText,
  countFetchCallsByUrl,
  escapeRegExp,
  expectElementTextToMatch,
  fillAndTab,
  getOpenCommandContainer,
  getOpenDialogContent,
  getOpenPopoverCommandItemTexts,
  getOpenPopoverContent,
  openPopoverAndExpectByLabel,
  openPopoverAndExpectByTrigger,
  openPopoverByLabelTextEnsuringSubmitDisabled,
  queryKeyFor,
  rx,
  rxExact,
  rxJoin,
  selectCommandItemInContainerEnsuringSubmitDisabled,
  submitButtonShouldBeDisabled,
  waitForDialogAndAssertText,
  waitForDialogState,
  waitForPopoverState,
  waitForTextToBeAbsent,
} from "@/tests/test-utils/vitest-browser.helpers";
import { wait } from "@/utils/utils.ts";

import { afterEach, describe, expect, test, vi } from "vitest";
import { page, userEvent } from "vitest/browser";

function codeRx(code: string) {
  // Popover items sometimes render as concatenated text like "DécouperSUB_01".
  // Word boundaries (\b) won't match between two word-chars, so instead:
  // - allow being preceded/followed by non-[A-Z0-9_] chars (or string edges)
  // - prevents false-positives like SUB_01 matching inside NET_SUB_01
  return new RegExp(
    String.raw`(?<![A-Z0-9_])${escapeRegExp(code)}(?![A-Z0-9_])`,
    ""
  );
}

async function clickEnabledButton(button: ReturnType<typeof page.getByRole>) {
  await expect.element(button).toBeEnabled();
  await userEvent.click(button);
}

async function assertLucideIconForOptionInContainer(
  containerEl: HTMLElement,
  optionName: RegExp,
  opts: {
    icon: "check" | "plus";
    present: boolean;
  }
) {
  const container = page.elementLocator(containerEl);
  const option = container.getByRole("option", { name: optionName });
  const icon = option.getByCss(`svg.lucide-${opts.icon}`);

  if (opts.present) {
    await expect.element(icon).toBeInTheDocument();
  } else {
    await expect.element(icon).not.toBeInTheDocument();
  }
}

async function assertLucideCheckIconForSkillInOpenPopover(
  skillCode: string,
  present: boolean
) {
  const openPopoverEl = getOpenPopoverContent();
  expect(openPopoverEl).not.toBeNull();

  await assertLucideIconForOptionInContainer(
    openPopoverEl!,
    codeRx(skillCode),
    {
      icon: "check",
      present,
    }
  );
}

type ControllerLike = {
  apiEndpoint: string;
  task?: string;
  label?: string;
  placeholder?: string;
  creationButtonText?: string;
};

const classCreatedWithOptional = {
  ...classCreated,
  id: "00000000-0000-4000-8000-000000009999",
  name: "2C",
  value: "2C",
};

const fx = fixtureCreateClassStepOne();
const {
  classesController,
  diplomasController,
  tasksController,
  studentsController,
  taskLabelController,
  skillsController,
} = fx.controllers;

const { createClassPostEndpoint } = fx.endpoints;
const classesQueryKey = queryKeyFor(classesController);

async function openCreateClassModal(opts?: { listAlreadyOpen?: boolean }) {
  // The "Créer une classe" button lives inside the StepOne classes popover.
  if (!opts?.listAlreadyOpen) {
    await openPopoverAndExpectByLabel(controllerLabelRegex(classesController), [
      classFetched.name,
      classFetched2.name,
    ]);
  }

  await userEvent.click(
    page.getByRole("button", { name: /Créer une classe/i })
  );
  await waitForDialogAndAssertText(/Créer une classe/i, { present: true });

  // Ensure the StepOne popover is closed; otherwise it can intercept events
  // and make subsequent popovers/dialogs flaky.
  await waitForPopoverState(false, 1000);
}

async function closeTopDialogByCancel() {
  const dialogEl = getOpenDialogContent();
  const dialog = page.elementLocator(dialogEl);
  await userEvent.click(dialog.getByRole("button", { name: /^Annuler$/i }));
}

async function selectDiplomaInClassCreationDialog(
  diploma: {
    degreeLevel: string;
    degreeYear: string;
  },
  opts?: { submitName?: string }
) {
  const submitName = opts?.submitName ?? "Créer la classe";

  // Use the shared helper so Radix popover open/portal + cmdk focus is handled consistently.
  await openPopoverByLabelTextEnsuringSubmitDisabled(
    submitName,
    controllerLabelRegex(diplomasController),
    {
      withinDialog: true,
      items: rxJoin(diploma.degreeLevel, diploma.degreeYear),
      timeout: 1500,
    }
  );
}

async function openNewTaskTemplateModalFromTasksPopover() {
  await openPopoverAndExpectByTrigger(controllerTriggerRegex(tasksController), [
    taskFetched.name,
    taskFetched2.name,
  ]);

  await userEvent.click(
    page.getByRole("button", {
      name: rxExact(String(tasksController.creationButtonText ?? "")),
    })
  );

  await waitForDialogAndAssertText(/Création de nouvelles tâches/i, {
    present: true,
    timeout: 1500,
  });
}

async function assertSkillsForCurrentDiplomaAndSelect(
  skillCodeToSelect: string,
  opts?: {
    expectPresent?: string[];
    expectAbsent?: string[];
    selectSkill?: boolean;
  }
) {
  // The skills popover is often disabled until the form has enough data.
  // Prime required fields to keep the test stable.

  const labels = [
    {
      name: rx(taskTemplateCreationInputControllers[0].title!),
      value: "template",
    },
    {
      name: rx(taskTemplateCreationInputControllers[1].title!),
      value: "Une description suffisamment longue.",
    },
  ];
  labels.forEach(async (element) => {
    await fillAndTab(page.getByLabelText(element.name), element.value);
  });

  await openPopoverByLabelTextEnsuringSubmitDisabled(
    "Ajouter",
    controllerLabelRegex(taskLabelController),
    {
      withinDialog: true,
      items: rx(taskFetched.name),
      timeout: 1500,
    }
  );

  // If skills were preselected, the submit button might become enabled.
  await submitButtonShouldBeDisabled("Ajouter");

  await openPopoverAndExpectByLabel(
    controllerLabelRegex(skillsController),
    opts?.expectPresent?.map((s) => codeRx(s)) ?? [codeRx(skillCodeToSelect)],
    { withinDialog: true, timeout: 1500 }
  );

  // No visual preselection: selected skills show a lucide "check" icon.
  // We assert its absence inside the currently open popover.

  const openPopoverEl = getOpenPopoverContent();
  expect(openPopoverEl).not.toBeNull();

  await expect
    .element(page.elementLocator(openPopoverEl!).getByCss("svg.lucide-check"))
    .not.toBeInTheDocument();

  if (opts?.expectAbsent?.length) {
    for (const s of opts.expectAbsent) {
      // Radix popovers are portaled and can leave hidden nodes in the DOM.
      // Assert against the *currently open* popover's command texts.
      await expect
        .poll(() => getOpenPopoverCommandItemTexts().join(" "), {
          timeout: 1500,
        })
        .not.toMatch(codeRx(s));
    }
  }

  // Optionally select a skill; assert icon toggles (absent -> present).
  if (opts?.selectSkill ?? true) {
    await assertLucideCheckIconForSkillInOpenPopover(skillCodeToSelect, false);

    // Force a visual state update before selecting (otherwise the test is too fast to notice).
    await wait(500);

    await selectCommandItemInContainerEnsuringSubmitDisabled(
      "Ajouter",
      getOpenCommandContainer(),
      codeRx(skillCodeToSelect),
      1500
    );

    await assertLucideCheckIconForSkillInOpenPopover(skillCodeToSelect, true);
  }

  // Close the popover with an outside click (Escape can close the dialog).
  await userEvent.click(page.elementLocator(getOpenDialogContent()));
  await waitForPopoverState(false, 1500);
}

async function runCreateFlow(args: {
  controllers: {
    classesController: ControllerLike;
    tasksController: ControllerLike;
    studentsController: ControllerLike;
  };
  createdClassName: string;
  createdClassPayload: unknown;
  fillDescription: boolean;
}) {
  const {
    controllers: { classesController, tasksController, studentsController },
  } = args;

  // Open classes popover and assert existing names
  await openPopoverAndExpectByLabel(controllerLabelRegex(classesController), [
    classFetched.name,
    classFetched2.name,
  ]);

  const getCallsBeforeCreation = countFetchCallsByUrl(
    classesController.apiEndpoint,
    "GET"
  );

  // Open creation modal
  await openCreateClassModal({ listAlreadyOpen: true });

  // Fill required and optional fields
  await fillAndTab(page.getByLabelText(/^Nom$/i), args.createdClassName);

  if (args.fillDescription) {
    await fillAndTab(
      page.getByLabelText(/^Description/i),
      "Une description optionnelle"
    );
  }

  // Diploma selection (required)
  await selectDiplomaInClassCreationDialog(diplomaFetched);

  // Task selection (required)
  await openPopoverAndExpectByTrigger(controllerTriggerRegex(tasksController), [
    taskFetched.name,
    taskFetched2.name,
  ]);

  await selectCommandItemInContainerEnsuringSubmitDisabled(
    "Créer la classe",
    getOpenCommandContainer(),
    rx(taskFetched.name),
    1500
  );

  // Close the multi-select popover without using Escape (Escape can close the dialog).
  await userEvent.click(
    page.getByRole("button", {
      name: controllerTriggerRegex(tasksController),
    })
  );

  // Students selection (required)
  await clickControlByLabelText(controllerLabelRegex(studentsController), {
    withinDialog: true,
  });

  // Ensure the student search dialog is opened
  await waitForDialogAndAssertText(/Recherche d'étudiants/i, { present: true });

  // Wait for student fetch to complete and the expected student to appear
  await expect
    .poll(() => countFetchCallsByUrl(studentsController.apiEndpoint, "GET"), {
      timeout: 1500,
    })
    .toBeGreaterThan(0);

  await expect
    .element(
      page.getByText(rxJoin(studentFetched.firstName, studentFetched.lastName))
    )
    .toBeInTheDocument();

  await userEvent.click(
    page.getByText(rxJoin(studentFetched.firstName, studentFetched.lastName))
  );

  const addStudents = page.getByRole("button", { name: /^Ajouter$/i });
  await clickEnabledButton(addStudents);

  // The main class-creation dialog stays open; only the student search dialog should close.
  // `waitForDialogAndAssertText(..., present: false)` can't be used here because it assumes
  // there are no dialogs open at all.
  await waitForTextToBeAbsent(/Recherche d'étudiants/i, { timeout: 1000 });

  // `defaultValue` on Radix/Shadcn Select does not reliably set the RHF value.
  // Explicitly select a school year option to ensure the form is valid.
  const currentYear = new Date().getFullYear();
  const defaultSchoolYear = `${currentYear} - ${currentYear + 1}`;
  const schoolYearField = page.getByLabelText(/^Année scolaire$/i);
  await userEvent.click(schoolYearField);
  await userEvent.click(
    page.getByRole("option", {
      name: rx(defaultSchoolYear),
    })
  );
  await expectElementTextToMatch(schoolYearField, rx(defaultSchoolYear), 1500);
  await userEvent.tab();

  const dialogEl = getOpenDialogContent();
  const dialog = page.elementLocator(dialogEl);

  // Click the dialog content itself to ensure focus is back in the dialog.
  // (Do not press Escape here: Radix dialogs close on Escape.)
  await userEvent.click(dialog);

  const submit = dialog.getByRole("button", { name: /^Créer la classe$/i });
  await clickEnabledButton(submit);

  // Ensure the real submit flow happened (POST fired) and assert cache updates.
  await assertPostUpdatedCacheWithoutExtraGet({
    queryKey: classesQueryKey,
    expectedValue: args.createdClassName,
    endpoint: classesController.apiEndpoint,
    getCallsBefore: getCallsBeforeCreation,
    openPopover: { label: controllerLabelRegex(classesController) },
    post: {
      endpoint: createClassPostEndpoint,
      count: 1,
      timeout: 2500,
    },
  });

  // Additional stricter assertion on the exact cached shape
  const cached = await waitForCache(classesQueryKey);
  expect(cached).toEqual([
    {
      groupTitle: "BTS",
      items: expect.arrayContaining([
        expect.objectContaining({ id: classFetched.id }),
        expect.objectContaining({ id: classFetched2.id }),
        expect.objectContaining({
          id: (args.createdClassPayload as { id: string }).id,
        }),
      ]),
    },
  ]);
}

setupUiTestState(
  <AppTestWrapper>
    <AppModals />
    <SamplePopoverInput
      pageId="class-creation"
      controller={classesController}
    />
  </AppTestWrapper>,
  {
    beforeEach: () => {
      const testName = expect.getState().currentTestName ?? "";
      const createClassPostResponse = testName.includes(
        "optional fields filled"
      )
        ? classCreatedWithOptional
        : classCreated;

      fixtureCreateClassStepOne({
        createClassPostResponse,
      }).installFetchStubs();
    },
  }
);

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("UI flow: class-creation (StepOne list)", () => {
  test("submit works with optional fields empty", async () => {
    await runCreateFlow({
      controllers: {
        classesController,
        tasksController,
        studentsController,
      },
      createdClassName: "2B",
      createdClassPayload: classCreated,
      fillDescription: false,
    });
  });

  test("submit works with optional fields filled", async () => {
    await runCreateFlow({
      controllers: {
        classesController,
        tasksController,
        studentsController,
      },
      createdClassName: "2C",
      createdClassPayload: classCreatedWithOptional,
      fillDescription: true,
    });
  });

  test("sync: switching diploma refreshes skills in new-task-template modal (no stale data, no preselection)", async () => {
    // Open class creation modal.
    await openCreateClassModal();

    // Fill required name (some controls can be disabled until the form is started).
    await fillAndTab(page.getByLabelText(/^Nom$/i), "Classe sync diplômes");

    // Select diploma 1.
    await selectDiplomaInClassCreationDialog(diplomaFetched);

    // Open task template creation modal from tasks CommandList, assert diploma-1 skills.
    await openNewTaskTemplateModalFromTasksPopover();
    await assertSkillsForCurrentDiplomaAndSelect("SUB_01", {
      expectPresent: ["SUB_01", "SUB_02"],
      expectAbsent: ["NET_SUB_01", "NET_SUB_02"],
    });

    await closeTopDialogByCancel();
    await waitForTextToBeAbsent(/Création de nouvelles tâches/i, {
      timeout: 1500,
    });

    // Switch to diploma 2.
    await selectDiplomaInClassCreationDialog(diplomaFetched2);

    // Re-open task template creation modal and assert diploma-2 skills.
    await openNewTaskTemplateModalFromTasksPopover();
    await assertSkillsForCurrentDiplomaAndSelect("NET_SUB_01", {
      expectPresent: ["NET_SUB_01", "NET_SUB_02"],
      expectAbsent: ["SUB_01", "SUB_02"],
    });
    await closeTopDialogByCancel();
    await waitForTextToBeAbsent(/Création de nouvelles tâches/i, {
      timeout: 1500,
    });

    // Switch back to diploma 1.
    await selectDiplomaInClassCreationDialog(diplomaFetched);

    // Re-open and ensure: (1) previous selections are not preselected, (2) skills are those of current diploma.
    await openNewTaskTemplateModalFromTasksPopover();
    await assertSkillsForCurrentDiplomaAndSelect("SUB_02", {
      expectPresent: ["SUB_01", "SUB_02"],
      expectAbsent: ["NET_SUB_01", "NET_SUB_02"],
    });
    await closeTopDialogByCancel();
  });

  test("sync: closing student search + class creation resets student preselection", async () => {
    // Open class creation modal.
    await openCreateClassModal();

    // Fill required name to ensure dependent controls are enabled.
    await fillAndTab(page.getByLabelText(/^Nom$/i), "Classe sync étudiants");

    // Select a diploma (keeps the flow consistent with the main create test).
    await selectDiplomaInClassCreationDialog(diplomaFetched);

    // Select one task so the form is in a realistic state.
    await openPopoverAndExpectByTrigger(
      controllerTriggerRegex(tasksController),
      [taskFetched.name, taskFetched2.name]
    );
    await selectCommandItemInContainerEnsuringSubmitDisabled(
      "Créer la classe",
      getOpenCommandContainer(),
      rx(taskFetched.name),
      1500
    );
    await userEvent.click(
      page.getByRole("button", {
        name: controllerTriggerRegex(tasksController),
      })
    );

    // Open student search dialog and select a student.
    await clickControlByLabelText(controllerLabelRegex(studentsController), {
      withinDialog: true,
    });
    await waitForDialogAndAssertText(/Recherche d'étudiants/i, {
      present: true,
      timeout: 2000,
    });

    await expect
      .poll(() => countFetchCallsByUrl(studentsController.apiEndpoint, "GET"), {
        timeout: 1500,
      })
      .toBeGreaterThan(0);

    const studentName = rxJoin(
      studentFetched.firstName,
      studentFetched.lastName
    );
    await expect.element(page.getByText(studentName)).toBeInTheDocument();
    await userEvent.click(page.getByText(studentName));

    const addStudents = page.getByRole("button", { name: /^Ajouter$/i });
    await clickEnabledButton(addStudents);

    // Student search dialog closes, class creation dialog stays open.
    await waitForTextToBeAbsent(/Recherche d'étudiants/i, { timeout: 1000 });

    // Close class creation modal.
    await closeTopDialogByCancel();
    await waitForDialogState(false, 1500);

    // Re-open class creation modal.
    await openCreateClassModal();

    // Re-fill minimal prereqs so student search can be opened again.
    await fillAndTab(
      page.getByLabelText(/^Nom$/i),
      "Classe sync étudiants (2)"
    );
    await selectDiplomaInClassCreationDialog(diplomaFetched);
    await openPopoverAndExpectByTrigger(
      controllerTriggerRegex(tasksController),
      [taskFetched.name, taskFetched2.name]
    );
    await selectCommandItemInContainerEnsuringSubmitDisabled(
      "Créer la classe",
      getOpenCommandContainer(),
      rx(taskFetched.name),
      1500
    );
    await userEvent.click(
      page.getByRole("button", {
        name: controllerTriggerRegex(tasksController),
      })
    );

    // Re-open student search: ensure nothing is preselected ("Ajouter" disabled until user selects).
    await clickControlByLabelText(controllerLabelRegex(studentsController), {
      withinDialog: true,
    });
    await waitForDialogAndAssertText(/Recherche d'étudiants/i, {
      present: true,
      timeout: 2000,
    });
    await expect
      .element(page.getByRole("button", { name: /^Ajouter$/i }))
      .toBeDisabled();

    // Additionally assert that no item is visually marked as selected (no validation/check icon).
    // In avatarDisplay mode, the selected state is shown as a Check icon inside the "Invite" button.
    const studentDialogEl = getOpenDialogContent();

    await assertLucideIconForOptionInContainer(studentDialogEl, studentName, {
      icon: "check",
      present: false,
    });

    await assertLucideIconForOptionInContainer(studentDialogEl, studentName, {
      icon: "plus",
      present: true,
    });
  });
});
