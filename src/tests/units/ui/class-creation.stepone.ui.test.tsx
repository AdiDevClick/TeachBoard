import { API_ENDPOINTS } from "@/configs/api.endpoints.config.ts";
import { AppModals } from "@/pages/AllModals/AppModals";
import { AppTestWrapper } from "@/tests/components/AppTestWrapper";
import { SamplePopoverInput } from "@/tests/components/class-creation/SamplePopoverInput";
import {
  classCreated,
  classFetched,
  classFetched2,
  diplomaFetched,
  studentFetched,
  taskFetched,
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
  fillAndTab,
  getOpenCommandContainer,
  getOpenDialogContent,
  openPopoverAndExpectByLabel,
  openPopoverByLabelText,
  openPopoverByTriggerName,
  queryKeyFor,
  rx,
  rxJoin,
  selectCommandItemInContainer,
  waitForDialogAndAssertText,
  waitForDialogState,
} from "@/tests/test-utils/vitest-browser.helpers";
import { afterEach, describe, expect, test, vi } from "vitest";
import { page, userEvent } from "vitest/browser";

type ControllerLike = {
  apiEndpoint: string;
  task?: string;
  label?: string;
  placeholder?: string;
  creationButtonText?: string;
};

const fx = fixtureCreateClassStepOne();
const {
  classesController,
  diplomasController,
  tasksController,
  studentsController,
} = fx.controllers as unknown as {
  classesController: ControllerLike;
  diplomasController: ControllerLike;
  tasksController: ControllerLike;
  studentsController: ControllerLike;
};
const classesQueryKey = queryKeyFor(classesController);

async function runCreateFlow(args: {
  controllers: {
    classesController: ControllerLike;
    diplomasController: ControllerLike;
    tasksController: ControllerLike;
    studentsController: ControllerLike;
  };
  createdClassName: string;
  createdClassPayload: unknown;
  fillDescription: boolean;
}) {
  const {
    controllers: {
      classesController,
      diplomasController,
      tasksController,
      studentsController,
    },
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
  await userEvent.click(
    page.getByRole("button", { name: /Créer une classe/i })
  );

  // Ensure modal is opened and title is present
  await waitForDialogAndAssertText(/Créer une classe/i, { present: true });

  // Fill required and optional fields
  await fillAndTab(page.getByLabelText(/^Nom$/i), args.createdClassName);

  if (args.fillDescription) {
    await fillAndTab(
      page.getByLabelText(/^Description/i),
      "Une description optionnelle"
    );
  }

  // Diploma selection (required)
  await openPopoverByLabelText(controllerLabelRegex(diplomasController), {
    withinDialog: true,
  });
  await selectCommandItemInContainer(
    getOpenCommandContainer(),
    rxJoin(diplomaFetched.degreeLevel, diplomaFetched.degreeYear)
  );

  // Task selection (required)
  await openPopoverByTriggerName(controllerTriggerRegex(tasksController));
  await selectCommandItemInContainer(
    getOpenCommandContainer(),
    rx(taskFetched.name)
  );

  // The task popover is multi-select and stays open after selection => Force close
  await userEvent.keyboard("{Escape}");

  // Students selection (required)
  await clickControlByLabelText(controllerLabelRegex(studentsController), {
    withinDialog: true,
  });

  // Ensure the student search dialog is opened
  await waitForDialogAndAssertText(/Recherche d'étudiants/i, { present: true });

  await selectCommandItemInContainer(
    getOpenCommandContainer(),
    rxJoin(studentFetched.firstName, studentFetched.lastName)
  );

  const addStudents = page.getByRole("button", { name: /^Ajouter$/i });
  await expect.element(addStudents).toBeEnabled();
  await userEvent.click(addStudents);

  await waitForDialogState(false, 1000);

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
  await expect
    .poll(() => schoolYearField.element().textContent ?? "", {
      timeout: 1500,
    })
    .toMatch(rx(defaultSchoolYear));
  await userEvent.tab();

  const dialogEl = getOpenDialogContent();
  const dialog = page.elementLocator(dialogEl);

  // Click the dialog content itself to ensure focus is back in the dialog.
  // (Do not press Escape here: Radix dialogs close on Escape.)
  await userEvent.click(dialog);

  const submit = dialog.getByRole("button", { name: /^Créer la classe$/i });
  await expect.element(submit).toBeEnabled();
  await userEvent.click(submit);

  // Ensure the real submit flow happened (POST fired) before we assert cache updates.
  await expect
    .poll(
      () =>
        countFetchCallsByUrl(API_ENDPOINTS.POST.CREATE_CLASS.endpoint, "POST"),
      { timeout: 2500 }
    )
    .toBe(1);

  await assertPostUpdatedCacheWithoutExtraGet({
    queryKey: classesQueryKey,
    expectedValue: args.createdClassName,
    endpoint: classesController.apiEndpoint,
    getCallsBefore: getCallsBeforeCreation,
    openPopover: { label: controllerLabelRegex(classesController) },
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
  { beforeEach: fx.installFetchStubs }
);

afterEach(() => {
  vi.unstubAllGlobals();
});

describe.skip("UI flow: class-creation (StepOne list)", () => {
  test("submit works with optional fields empty", async () => {
    await runCreateFlow({
      controllers: {
        classesController,
        diplomasController,
        tasksController,
        studentsController,
      },
      createdClassName: "2B",
      createdClassPayload: classCreated,
      fillDescription: false,
    });
  });

  test("submit works with optional fields filled", async () => {
    const classCreatedWithOptional = {
      ...classCreated,
      id: "00000000-0000-4000-8000-000000009999",
      name: "2C",
      value: "2C",
    };

    await runCreateFlow({
      controllers: {
        classesController,
        diplomasController,
        tasksController,
        studentsController,
      },
      createdClassName: "2C",
      createdClassPayload: classCreatedWithOptional,
      fillDescription: true,
    });
  });
});
