import { taskTemplateCreationInputControllers } from "@/data/inputs-controllers.data";
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
  initSetup,
  iterateDiplomaSkillAssertions,
  openStudentSearchAndSelect,
  prepareClassCreationForm,
  reopenAndPrepare,
  runCreateFlow,
} from "@/tests/units/ui/functions/class-creation/class-creation.functions.ts";
import { clickControlAndWaitForDialog } from "@/tests/units/ui/functions/useful-ui.functions";

import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { page } from "vitest/browser";

import type { InputControllerLike } from "@/tests/test-utils/class-creation/regex.functions";

const classCreatedWithOptional = {
  ...classCreated,
  id: "00000000-0000-4000-8000-000000009999",
  name: "2C",
  value: "2C",
};
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

let flowArgs: RunCreateFlowArgs;
let ctx: Ctx;

type RunCreateFlowArgs = Parameters<typeof runCreateFlow>[0];
type ControllersForCreate = RunCreateFlowArgs["controllers"];

type Ctx = {
  classesController: InputControllerLike;
  diplomasController: InputControllerLike;
  tasksController: InputControllerLike;
  taskLabelController: InputControllerLike;
  skillsController: InputControllerLike;
  studentsController: InputControllerLike;
  flowArgs: RunCreateFlowArgs;
  flowArgs2: RunCreateFlowArgs;
  labeler: RunCreateFlowArgs["labeler"] & { apiEndpoint?: string };
  labels: { name: RegExp; value: string }[];
  tasksNames: string[];
  installCreateClassStubs: (postResponse: unknown) => void;
};

function data(
  controllers: ControllersForCreate,
  labeler: Ctx["labeler"],
  classesQueryKey: readonly unknown[],
  createClassPostEndpoint: string
): RunCreateFlowArgs {
  return {
    controllers,
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
}

setupUiTestState(null, {
  beforeEach: async () => {
    const res = await initSetup(
      "createClassStepOne",
      "classesController",
      "class-creation",
      { routeArgs: [] }
    );
    const { getRoutes } = res;
    const {
      classesController,
      diplomasController,
      tasksController,
      taskLabelController,
      skillsController,
      studentsController,
    } = res.controllers;

    const classesQueryKey = queryKeyFor(classesController);

    const createClassPostEndpoint =
      getRoutes.createClassStepOne().post.endpoint;

    const labeler = {
      name: "Créer une classe",
      controller: classesController,
      nameArray: [res.sample.classFetched.name, res.sample.classFetched2.name],
      apiEndpoint: classesController.apiEndpoint,
    };

    flowArgs = data(
      {
        classesController,
        diplomasController,
        tasksController,
        studentsController,
      },
      labeler,
      classesQueryKey,
      createClassPostEndpoint
    );

    const flowArgs2 = {
      ...flowArgs,
      createdClassPayload: classCreatedWithOptional,
      createdClassName: "2C",
      fillDescription: true,
    };

    ctx = {
      classesController,
      diplomasController,
      tasksController,
      taskLabelController,
      skillsController,
      studentsController,
      flowArgs,
      flowArgs2,
      labeler,
      labels,
      tasksNames,
      installCreateClassStubs: (postResponse: unknown) =>
        getRoutes
          .createClassStepOne({ createClassPostResponse: postResponse })
          .installFetchStubs(),
    } satisfies Ctx;
  },
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("UI flow: class-creation (StepOne list)", () => {
  beforeEach(() => {
    const testName = expect.getState().currentTestName ?? "";
    const createClassPostResponse = testName.includes("optional fields filled")
      ? classCreatedWithOptional
      : classCreated;
    ctx.installCreateClassStubs(createClassPostResponse);
  });

  test("submit works with optional fields empty", async () => {
    expect(ctx).toBeDefined();
    await runCreateFlow(ctx.flowArgs);
  });

  test("submit works with optional fields filled", async () => {
    expect(ctx).toBeDefined();
    await runCreateFlow(ctx.flowArgs2);
  });

  test("sync: switching diploma refreshes skills in new-task-template modal (no stale data, no preselection)", async () => {
    // Open class creation modal.
    await baseInit(ctx.labeler);

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
      diplomasController: ctx.diplomasController,
      tasksController: ctx.tasksController,
      tasksNames: ctx.tasksNames,
      taskLabelController: ctx.taskLabelController,
      skillsController: ctx.skillsController,
      taskNameForLabelSelection: taskFetched.name,
      primeFields: ctx.labels.map((l) => ({ label: l.name, value: l.value })),
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
      labeler: ctx.labeler,
      name: "Classe sync étudiants (2)",
      fillDescription: false,
      diplomasController: ctx.diplomasController,
      diplomaToSelect: diplomaFetched,
      tasksController: ctx.tasksController,
      taskToSelect: taskFetched.name,
      tasksNames: ctx.tasksNames,
    });

    // Open student search dialog and select a student using shared helper.
    await openStudentSearchAndSelect(
      ctx.studentsController,
      ctx.flowArgs.studentName
    );

    // Re-open and prepare modal using helper to reduce duplication
    await reopenAndPrepare(ctx.labeler, {
      name: "Classe sync étudiants (2)",
      fillDescription: false,
      diplomasController: ctx.diplomasController,
      diplomaToSelect: diplomaFetched,
      tasksController: ctx.tasksController,
      taskToSelect: taskFetched.name,
      tasksNames: ctx.tasksNames,
    });

    // Re-open student search: ensure nothing is preselected ("Ajouter" disabled until user selects).
    await clickControlAndWaitForDialog(
      controllerLabelRegex(ctx.studentsController),
      /Recherche d'étudiants/i,
      { withinDialog: true, timeout: 2000 }
    );

    await submitButtonShouldBeDisabled("Ajouter");

    const icons = [
      {
        code: ctx.flowArgs.studentName,
        icon: "check",
        present: false,
      },
      { code: ctx.flowArgs.studentName, icon: "plus", present: true },
    ];

    // Additionally assert that no item is visually marked as selected (no validation/check icon).
    // In avatarDisplay mode, the selected state is shown as a Check icon inside the "Invite" button.
    await assertIconsInPopover(icons);
  });
});
