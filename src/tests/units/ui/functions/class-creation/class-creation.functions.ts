import type { InputControllerLike } from "@/tests/test-utils/class-creation/regex.functions.ts";
import {
  controllerLabelRegex,
  controllerTriggerRegex,
} from "@/tests/test-utils/class-creation/regex.functions.ts";
import {
  assertPostUpdatedCacheWithoutExtraGet,
  waitForCache,
} from "@/tests/test-utils/tests.functions.ts";
import {
  checkFormValidityAndSubmit,
  countFetchCallsByUrl,
  expectElementTextToMatch,
  fillFieldsEnsuringSubmitDisabled,
  getLastPostJsonBodyByUrl,
  getOpenCommandContainer,
  getOpenDialogContent,
  getOpenPopoverCommandItemTexts,
  getOpenPopoverContent,
  openPopoverAndExpectByLabel,
  openPopoverAndExpectByTrigger,
  openPopoverByLabelTextEnsuringSubmitDisabled,
  rx,
  rxJoin,
  selectCommandItemInContainerEnsuringSubmitDisabled,
  submitButtonShouldBeDisabled,
  waitForDialogState,
  waitForPopoverState,
  waitForTextToBeAbsent,
} from "@/tests/test-utils/vitest-browser.helpers.ts";
import {
  assertLucideCheckIconInOpenPopover,
  clickControlAndWaitForDialog,
  clickEnabledButton,
  clickTriggerAndWaitForPopoverState,
  closeTopDialogByCancel,
  codeRx,
  openModalAndAssertItsOpenedAndReady,
} from "@/tests/units/ui/functions/useful-ui.functions.ts";

import { wait } from "@/utils/utils.ts";
import { expect } from "vitest";
import { page, userEvent } from "vitest/browser";

/**
 * Initializes the class-creation modal for tests.
 */
export async function baseInit(labeler: {
  name: string | RegExp;
  controller: InputControllerLike;
  nameArray: (string | RegExp)[];
}) {
  // Open class creation modal.
  await openModalAndAssertItsOpenedAndReady(labeler.name, {
    controller: labeler.controller,
    nameArray: labeler.nameArray,
  });
}

/**
 * Selects a diploma inside the class-creation dialog.
 *
 * @param controller - Diplomas controller
 * @param diploma - Diploma to select
 * @param opts - Options
 */
export async function selectDiplomaInClassCreationDialog(
  controller: InputControllerLike,
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
    controllerLabelRegex(controller),
    {
      withinDialog: true,
      items: rxJoin(diploma.degreeLevel, diploma.degreeYear),
      timeout: 1500,
    }
  );
}

/**
 * Opens the new-task-template modal from the tasks popover in class-creation, and asserts it's opened and ready.
 *
 * @param label - Label or regex of the creation button to click (defaults to the tasks controller trigger).
 * @param tasksNames - Names of existing tasks to assert in the popover (defaults to test tasksNames).
 * @param controller - Optional controller for the tasks popover.
 */
export async function openNewTaskTemplateModalFromTasksPopover(
  label: string | RegExp,
  tasksNamesParam: string[],
  controller?: InputControllerLike
): Promise<void> {
  await openModalAndAssertItsOpenedAndReady(label, {
    controller: controller,
    nameArray: tasksNamesParam,
    readyText: /Création de nouvelles tâches/i,
  });
}

/**
 * Asserts that skills list is refreshed for the currently selected diploma, and
 * optionally selects a skill (asserting lucide-check toggles).
 *
 * This is meant to be used inside the "Création de nouvelles tâches" modal.
 */
export async function assertSkillsForCurrentDiplomaAndSelect(params: {
  taskLabelController: InputControllerLike;
  skillsController: InputControllerLike;
  taskNameForLabelSelection: string;
  skillCodeToSelect: string;
  primeFields?: Array<{ label: string | RegExp; value: string }>;
  expectPresent?: string[];
  expectAbsent?: string[];
  selectSkill?: boolean;
  submitName?: string;
}) {
  const submitName = params.submitName ?? "Ajouter";

  // The skills popover is often disabled until the form has enough data.
  // Prime required fields to keep the test stable.
  if (params.primeFields?.length) {
    await fillFieldsEnsuringSubmitDisabled(submitName, params.primeFields);
  }

  await openPopoverByLabelTextEnsuringSubmitDisabled(
    submitName,
    controllerLabelRegex(params.taskLabelController),
    {
      withinDialog: true,
      items: rx(params.taskNameForLabelSelection),
      timeout: 1500,
    }
  );

  // If skills were preselected, the submit button might become enabled.
  await submitButtonShouldBeDisabled(submitName);

  await openPopoverAndExpectByLabel(
    controllerLabelRegex(params.skillsController),
    params.expectPresent?.map((s) => codeRx(s)) ?? [
      codeRx(params.skillCodeToSelect),
    ],
    { withinDialog: true, timeout: 1500 }
  );

  // No visual preselection: selected skills show a lucide "check" icon.
  // We assert its absence inside the currently open popover.
  const openPopoverEl = getOpenPopoverContent();
  expect(openPopoverEl).not.toBeNull();
  await expect
    .element(page.elementLocator(openPopoverEl!).getByCss("svg.lucide-check"))
    .not.toBeInTheDocument();

  if (params.expectAbsent?.length) {
    for (const s of params.expectAbsent) {
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
  if (params.selectSkill ?? true) {
    await assertLucideCheckIconInOpenPopover(
      params.skillCodeToSelect,
      false,
      "check"
    );

    // Force a visual state update before selecting (otherwise the test is too fast to notice).
    await wait(500);

    await selectCommandItemInContainerEnsuringSubmitDisabled(
      submitName,
      getOpenCommandContainer(),
      codeRx(params.skillCodeToSelect),
      1500
    );

    await assertLucideCheckIconInOpenPopover(
      params.skillCodeToSelect,
      true,
      "check"
    );
  }

  // Close the popover with an outside click (Escape can close the dialog).
  await userEvent.click(page.elementLocator(getOpenDialogContent()));
  await waitForPopoverState(false, 1500);
}

/**
 * Iterates through diploma/skill selection assertions in the class-creation dialog.
 *
 * @param params - Parameters.
 */
export async function iterateDiplomaSkillAssertions(params: {
  diplomasController: InputControllerLike;
  tasksController: InputControllerLike;
  tasksNames: string[];
  taskLabelController: InputControllerLike;
  skillsController: InputControllerLike;
  taskNameForLabelSelection: string;
  primeFields?: Array<{ label: string | RegExp; value: string }>;
  steps: Array<{
    diploma: { degreeLevel: string; degreeYear: string };
    skillToSelect: string;
    expectPresent?: string[];
    expectAbsent?: string[];
    selectSkill?: boolean;
  }>;
}) {
  const {
    diplomasController,
    tasksController,
    tasksNames,
    taskLabelController,
    skillsController,
    taskNameForLabelSelection,
    primeFields,
    steps,
  } = params;

  for (const step of steps) {
    // Select the diploma (safe to select even if already selected).
    await selectDiplomaInClassCreationDialog(diplomasController, step.diploma);

    // Open the tasks popover and then open the new-task-template modal
    const openButton = tasksController.creationButtonText;
    if (!openButton) {
      throw new Error("tasksController.creationButtonText is required");
    }

    await openNewTaskTemplateModalFromTasksPopover(
      openButton,
      tasksNames,
      tasksController
    );

    // Assert skills for the current diploma, and select if needed
    await assertSkillsForCurrentDiplomaAndSelect({
      taskLabelController,
      skillsController,
      taskNameForLabelSelection,
      primeFields,
      skillCodeToSelect: step.skillToSelect,
      expectPresent: step.expectPresent,
      expectAbsent: step.expectAbsent,
      selectSkill: step.selectSkill,
    });

    // Close the modal
    await closeTopDialogByCancel();
    await waitForTextToBeAbsent(/Création de nouvelles tâches/i, {
      timeout: 1500,
    });
  }
}

/**
 * Prepares the class creation form by optionally opening the modal, filling
 * the name/description, selecting a diploma and selecting a task template.
 */
export async function prepareClassCreationForm(opts: {
  labeler?: {
    name: string | RegExp;
    controller: InputControllerLike;
    nameArray: (string | RegExp)[];
    apiEndpoint?: string;
  };
  modalAlreadyOpen?: boolean;
  name: string;
  fillDescription?: boolean;
  diplomasController: InputControllerLike;
  diplomaToSelect: { degreeLevel: string; degreeYear: string };
  tasksController: InputControllerLike;
  taskToSelect: string;
  tasksNames?: string[];
  submitName?: string;
}) {
  const submitName = opts.submitName ?? "Créer la classe";
  let getCallsBeforeCreation;

  if (!opts.modalAlreadyOpen) {
    if (!opts.labeler)
      throw new Error("labeler is required when modal is not already open");
    await baseInit(opts.labeler);

    // Snapshot GET count after initial fetch (triggered by opening the popover)
    const endpoint = opts.labeler.apiEndpoint;
    if (endpoint) {
      getCallsBeforeCreation = countFetchCallsByUrl(endpoint);
    }
  }

  await fillFieldsEnsuringSubmitDisabled(submitName, [
    { label: /^Nom$/i, value: opts.name },
    ...(opts.fillDescription
      ? [{ label: /^Description/i, value: "Une description optionnelle" }]
      : []),
  ]);

  await selectDiplomaInClassCreationDialog(
    opts.diplomasController,
    opts.diplomaToSelect
  );

  await selectTaskTemplate(
    opts.tasksController,
    opts.taskToSelect,
    opts.tasksNames,
    submitName
  );

  return getCallsBeforeCreation;
}

/**
 * Runs the full create-class flow used by tests. Extracted here so tests can
 * reuse the same implementation.
 */
export async function runCreateFlow(args: {
  controllers: {
    classesController: InputControllerLike;
    tasksController: InputControllerLike;
    studentsController: InputControllerLike;
    diplomasController: InputControllerLike;
  };
  createdClassName: string;
  createdClassPayload: { id: string };
  fillDescription: boolean;
  // Context from the test needed for assertions
  labeler: {
    name: string | RegExp;
    controller: InputControllerLike;
    nameArray: (string | RegExp)[];
  };
  diplomaToSelect: { degreeLevel: string; degreeYear: string };
  tasksNames: string[];
  classesQueryKey: readonly unknown[];
  createClassPostEndpoint: string;
  classFetched: { id: string };
  classFetched2: { id: string };
  studentName: string | RegExp;
  taskToSelect?: string;
}) {
  const {
    controllers: {
      classesController,
      tasksController,
      studentsController,
      diplomasController,
    },
  } = args;

  // Open creation modal & grab the SNAPSHOT of GET calls
  const getCallsBeforeCreation = await prepareClassCreationForm({
    labeler: args.labeler,
    name: "Main Classe test",
    fillDescription: args.fillDescription,
    diplomasController,
    diplomaToSelect: args.diplomaToSelect,
    tasksController,
    taskToSelect: args.taskToSelect ?? args.tasksNames[0],
    tasksNames: args.tasksNames,
  });

  // Open student search dialog and select the expected student
  await openStudentSearchAndSelect(studentsController, args.studentName);

  await selectDefaultSchoolYear();

  await ensureDialogHasFocus();

  // Ensure there are no form validation alerts, then submit
  await checkFormValidityAndSubmit("Créer la classe");

  // Ensure the real submit flow happened (POST fired) and assert cache updates.
  await assertPostUpdatedCacheWithoutExtraGet({
    queryKey: args.classesQueryKey,
    expectedValue: args.createdClassName,
    endpoint: classesController.apiEndpoint as string,
    getCallsBefore: getCallsBeforeCreation!,
    openPopover: { label: controllerLabelRegex(classesController) },
    post: {
      endpoint: args.createClassPostEndpoint,
      count: 1,
      timeout: 2500,
    },
  });

  // Additional stricter assertion on the exact cached shape
  const cached = await waitForCache(args.classesQueryKey);
  expect(cached).toEqual([
    {
      groupTitle: "BTS",
      items: expect.arrayContaining([
        expect.objectContaining({ id: args.classFetched.id }),
        expect.objectContaining({ id: args.classFetched2.id }),
        expect.objectContaining({ id: args.createdClassPayload.id }),
      ]),
    },
  ]);

  // Assert the POST payload contains the transformed schoolYear (YYYY-YYYY)
  const lastBody = getLastPostJsonBodyByUrl(args.createClassPostEndpoint);
  const currentYear = new Date().getFullYear();
  expect(lastBody).toMatchObject({
    schoolYear: `${currentYear}-${currentYear + 1}`,
  });
}

/**
 * Selects one task template from the tasks popover and closes it reliably.
 */
export async function selectTaskTemplate(
  tasksController: InputControllerLike,
  taskName: string,
  tasksNames?: string[],
  submitName = "Créer la classe",
  timeout = 1500
) {
  await openPopoverAndExpectByTrigger(
    controllerTriggerRegex(tasksController),
    tasksNames ?? [taskName]
  );
  await selectCommandItemInContainerEnsuringSubmitDisabled(
    submitName,
    getOpenCommandContainer(),
    rx(taskName),
    timeout
  );
  await clickTriggerAndWaitForPopoverState(
    controllerTriggerRegex(tasksController),
    false
  );
}

/**
 * Opens the student search dialog, waits for results and selects a student.
 */
export async function openStudentSearchAndSelect(
  studentsController: InputControllerLike,
  studentName: string | RegExp,
  opts?: { timeout?: number }
) {
  await clickControlAndWaitForDialog(
    controllerLabelRegex(studentsController),
    /Recherche d'étudiants/i,
    {
      withinDialog: true,
      timeout: opts?.timeout ?? 2000,
    }
  );

  await expect
    .poll(
      () =>
        countFetchCallsByUrl(studentsController.apiEndpoint as string, "GET"),
      {
        timeout: 1500,
      }
    )
    .toBeGreaterThan(0);

  await expect.element(page.getByText(studentName)).toBeInTheDocument();
  await userEvent.click(page.getByText(studentName));
  await clickEnabledButton("Ajouter");
  await waitForTextToBeAbsent(/Recherche d'étudiants/i, { timeout: 1000 });
}

/**
 * Selects the default/current school year in the open dialog.
 */
export async function selectDefaultSchoolYear() {
  const currentYear = new Date().getFullYear();
  const defaultSchoolYear = `${currentYear} - ${currentYear + 1}`;
  const schoolYearField = page.getByLabelText(/^Année scolaire$/i);
  await userEvent.click(schoolYearField);
  await userEvent.click(
    page.getByRole("option", { name: rx(defaultSchoolYear) })
  );
  await expectElementTextToMatch(schoolYearField, rx(defaultSchoolYear), 1500);
  await userEvent.tab();
}

/**
 * Ensure the open dialog has focus by clicking its content.
 */
export async function ensureDialogHasFocus() {
  const dialogEl = getOpenDialogContent();
  const dialog = page.elementLocator(dialogEl);
  await userEvent.click(dialog);
}

/**
 * Close the top dialog, re-open the class-creation modal and prepare the
 * basic prereqs in one call (reduces test-side boilerplate).
 */
export async function reopenAndPrepare(
  labeler: {
    name: string | RegExp;
    controller: InputControllerLike;
    nameArray: (string | RegExp)[];
  },
  prepareOpts: Parameters<typeof prepareClassCreationForm>[0]
) {
  // Try to close top dialog if one is open; swallow when not.
  try {
    await closeTopDialogByCancel();
    await waitForDialogState(false, 1500);
  } catch {
    // No dialog open: continue, nothing to close.
  }

  await openModalAndAssertItsOpenedAndReady(labeler.name, {
    controller: labeler.controller,
    nameArray: labeler.nameArray,
  });

  await prepareClassCreationForm({ modalAlreadyOpen: true, ...prepareOpts });
}

/**
 * Asserts that the given skill icons are present or absent in the currently open skills popover.
 */
export async function assertIconsInPopover(
  icons: Array<{
    code: string | RegExp;
    icon: string;
    present: boolean;
  }>
): Promise<void> {
  for (const { code, icon, present } of icons) {
    await assertLucideCheckIconInOpenPopover(code, present, icon);
  }
}
