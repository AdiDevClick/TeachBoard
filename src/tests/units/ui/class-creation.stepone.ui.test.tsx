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
import { controllerLabelRegex } from "@/tests/test-utils/class-creation/regex.functions";

import {
  fillAndTab,
  queryKeyFor,
  rx,
  rxJoin,
  submitButtonShouldBeDisabled,
} from "@/tests/test-utils/vitest-browser.helpers";

import {
  assertIconsInPopover,
  baseInit,
  iterateDiplomaSkillAssertions,
  openStudentSearchAndSelect,
  prepareClassCreationForm,
  reopenAndPrepare,
  runCreateFlow,
} from "@/tests/units/ui/functions/class-creation/class-creation.functions.ts";
import { clickControlAndWaitForDialog } from "@/tests/units/ui/functions/useful-ui.functions";

import { afterEach, describe, expect, test, vi } from "vitest";
import { page } from "vitest/browser";

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
} = fx.controllers;

const createClassPostEndpoint = fx.post.endpoint;
const classesQueryKey = queryKeyFor(classesController);
const tasksNames = [taskFetched.name, taskFetched2.name];
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
const labeler = {
  name: "Créer une classe",
  controller: classesController,
  nameArray: [classFetched.name, classFetched2.name],
};

const flowArgs = {
  controllers: fx.controllers,
  createdClassName: classCreated.name,
  createdClassPayload: classCreated,
  fillDescription: false,
  // context
  labeler,
  diplomaToSelect: diplomaFetched,
  tasksNames,
  classesQueryKey,
  createClassPostEndpoint,
  classFetched,
  classFetched2,
  studentName: rxJoin(studentFetched.firstName, studentFetched.lastName),
};

const flowArgs2 = {
  ...flowArgs,
  createdClassName: "2C",
  createdClassPayload: classCreatedWithOptional,
  fillDescription: true,
};

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
    await runCreateFlow(flowArgs);
  });

  test("submit works with optional fields filled", async () => {
    await runCreateFlow(flowArgs2);
  });

  test("sync: switching diploma refreshes skills in new-task-template modal (no stale data, no preselection)", async () => {
    // Open class creation modal.
    await baseInit(labeler);

    // Fill required name (some controls can be disabled until the form is started).
    await fillAndTab(page.getByLabelText(/^Nom$/i), "Classe sync diplômes");

    // Derive skill codes from fixtures to avoid hardcoded strings and keep the test resilient to sample data changes
    const subskills1 = diplomaFetched?.skills?.[0]?.subSkills ?? [];
    const subskills2 = diplomaFetched2?.skills?.[0]?.subSkills ?? [];
    const subA = subskills1[0]?.code;
    const subB = subskills1[1]?.code;
    const A = subskills2[0]?.code;
    const B = subskills2[1]?.code;

    await iterateDiplomaSkillAssertions({
      ...flowArgs.controllers,
      tasksNames,
      taskNameForLabelSelection: taskFetched.name,
      primeFields: labels.map((l) => ({ label: l.name, value: l.value })),
      steps: [
        {
          diploma: diplomaFetched,
          skillToSelect: subA,
          expectPresent: [subA, subB],
          expectAbsent: [A, B],
        },
        {
          diploma: diplomaFetched2,
          skillToSelect: A,
          expectPresent: [A, B],
          expectAbsent: [subA, subB],
        },
        {
          diploma: diplomaFetched,
          skillToSelect: subB,
          expectPresent: [subA, subB],
          expectAbsent: [A, B],
        },
      ],
    });
  });

  test("sync: closing student search + class creation resets student preselection", async () => {
    // Open creation modal & grab the SNAPSHOT of GET calls
    await prepareClassCreationForm({
      labeler,
      name: "Classe sync étudiants (2)",
      fillDescription: false,
      diplomasController,
      diplomaToSelect: diplomaFetched,
      tasksController,
      taskToSelect: taskFetched.name,
      tasksNames,
    });

    // Open student search dialog and select a student using shared helper.
    await openStudentSearchAndSelect(studentsController, flowArgs.studentName);

    // Re-open and prepare modal using helper to reduce duplication
    await reopenAndPrepare(labeler, {
      name: "Classe sync étudiants (2)",
      fillDescription: false,
      diplomasController,
      diplomaToSelect: diplomaFetched,
      tasksController,
      taskToSelect: taskFetched.name,
      tasksNames,
    });

    // Re-open student search: ensure nothing is preselected ("Ajouter" disabled until user selects).
    await clickControlAndWaitForDialog(
      controllerLabelRegex(studentsController),
      /Recherche d'étudiants/i,
      { withinDialog: true, timeout: 2000 }
    );

    await submitButtonShouldBeDisabled("Ajouter");

    const icons = [
      {
        code: flowArgs.studentName,
        icon: "check",
        present: false,
      },
      { code: flowArgs.studentName, icon: "plus", present: true },
    ];

    // Additionally assert that no item is visually marked as selected (no validation/check icon).
    // In avatarDisplay mode, the selected state is shown as a Check icon inside the "Invite" button.
    await assertIconsInPopover(icons);
  });
});
