import { taskTemplateCreationInputControllers } from "@/features/class-creation/components/TaskTemplateCreation/forms/task-template-inputs";
import {
  classCreated,
  classFetched,
  classFetched2,
  diplomaFetched,
  diplomaFetched2,
  studentFetched,
  taskFetched,
  taskFetched2,
  taskFetched3,
  taskFetched4,
} from "@/tests/samples/class-creation-sample-datas";

import type {
  ClassDto,
  CreateClassResponseData,
} from "@/api/types/routes/classes.types";
import type { TaskTemplateDto } from "@/api/types/routes/task-templates.types";
import { setupUiTestState } from "@/tests/test-utils/class-creation/class-creation.ui.shared";
import { controllerLabelRegex } from "@/tests/test-utils/class-creation/regex.functions";
import { waitForCache } from "@/tests/test-utils/tests.functions";

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
const tasksNames = [
  taskFetched.name,
  taskFetched2.name,
  taskFetched3.name,
  taskFetched4.name,
];
const tasksToSelectForSubmit = tasksNames.slice(0, 3);
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
  flowArgsToggle: RunCreateFlowArgs;
  labeler: RunCreateFlowArgs["labeler"] & { apiEndpoint?: string };
  labels: { name: RegExp; value: string }[];
  tasksNames: string[];
  taskTemplateIdByName: Record<string, string>;
  installCreateClassStubs: (_postResponse: unknown) => void;
};

function data(
  controllers: ControllersForCreate,
  labeler: Ctx["labeler"],
  classesQueryKey: readonly unknown[],
  createClassPostEndpoint: string,
): RunCreateFlowArgs {
  return {
    controllers,
    createdClassName: classCreated.name,
    createdClassPayload: classCreated as unknown as CreateClassResponseData,
    fillDescription: false,
    // context
    labeler,
    diplomaToSelect: diplomaFetched,
    tasksNames,
    classesQueryKey,
    createClassPostEndpoint,
    classFetched: classFetched as unknown as ClassDto,
    classFetched2: classFetched2 as unknown as ClassDto,
    studentName: rxJoin(studentFetched.firstName, studentFetched.lastName),
  };
}

setupUiTestState(null, {
  beforeEach: async () => {
    const res = await initSetup(
      "createClassStepOne",
      "classesController",
      "class-creation",
      { routeArgs: [] },
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
      apiEndpoint: classesController.apiEndpoint as string,
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
      createClassPostEndpoint,
    );

    const taskTemplateIdByName = Object.fromEntries(
      (res.sample.taskTemplateFetch.taskTemplates ?? []).map(
        (tpl: TaskTemplateDto) => [tpl.task.name, tpl.id],
      ),
    );

    // Ensure the test selects at least 3 templates during creation to reflect the multi-select feature
    flowArgs.tasksToSelect = tasksToSelectForSubmit;

    const flowArgs2 = {
      ...flowArgs,
      createdClassPayload:
        classCreatedWithOptional as unknown as CreateClassResponseData,
      createdClassName: "2C",
      fillDescription: true,
    };

    // Also select at least 3 templates for the optional-fields flow
    flowArgs2.tasksToSelect = tasksToSelectForSubmit;

    const flowArgsToggle: RunCreateFlowArgs = {
      ...flowArgs,
      // Explicitly test the toggle scenario: select 3, remove 1 via tag click, add another.
      tasksToSelect: undefined,
      tasksToggleSelection: {
        availableTaskNames: tasksNames,
        initialSelectNames: [tasksNames[0], tasksNames[1], tasksNames[2]],
        removeName: tasksNames[1],
        addName: tasksNames[3],
        taskTemplateIdByName,
      },
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
      flowArgsToggle,
      labeler,
      labels,
      tasksNames,
      taskTemplateIdByName,
      installCreateClassStubs: (_postResponse: unknown) =>
        getRoutes
          .createClassStepOne({ createClassPostResponse: _postResponse })
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
    let createClassPostResponse = testName.includes("optional fields filled")
      ? classCreatedWithOptional
      : classCreated;

    // for the cache-focused spec we want the response to include a template
    // carrying modules; the test will assert their presence below.
    if (testName.startsWith("cache:")) {
      // pick the first template name/ID from the fixture map if available
      const firstTemplateId =
        Object.values(ctx.taskTemplateIdByName)[0] ?? "template-1";
      const firstTaskName = ctx.tasksNames[0] || "foo";

      createClassPostResponse = {
        ...createClassPostResponse,
        templates: [
          {
            id: firstTemplateId,
            task: { id: "t1", name: firstTaskName, description: "" },
            // modules array may be string codes or objects depending on API
            modules: ["mod-a", "mod-b"],
          },
        ],
      } as unknown as typeof createClassPostResponse;
    }

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

  test("tasks multi-select: select 3, remove 1, add 1 updates POST payload", async () => {
    expect(ctx).toBeDefined();
    await runCreateFlow(ctx.flowArgsToggle);
  });

  test("cache: created class is selectable from cache without refetch", async () => {
    expect(ctx).toBeDefined();

    // perform regular creation flow; util above already ensures no extra GET
    await runCreateFlow(ctx.flowArgs);

    const cached = await waitForCache(ctx.flowArgs.classesQueryKey);
    const groups = Array.isArray(cached) ? cached : [];

    const createdItem = groups
      .flatMap((group) => {
        const maybeItems =
          group && typeof group === "object"
            ? Reflect.get(group, "items")
            : undefined;
        return Array.isArray(maybeItems) ? maybeItems : [];
      })
      .find((item) => {
        if (!item || typeof item !== "object") return false;
        return Reflect.get(item, "id") === ctx.flowArgs.createdClassPayload.id;
      });

    expect(createdItem).toBeDefined();

    // basic sanity: cached object carries id and name/value fields
    if (createdItem && typeof createdItem === "object") {
      expect(Reflect.get(createdItem, "id")).toBe(
        ctx.flowArgs.createdClassPayload.id,
      );
      expect(
        Reflect.get(createdItem, "name") || Reflect.get(createdItem, "value"),
      ).toBe(ctx.flowArgs.createdClassPayload.name);

      // when a template is included we expect its modules to be cached too
      const templates = Reflect.get(createdItem, "templates");
      if (Array.isArray(templates) && templates.length > 0) {
        const mods = Reflect.get(templates[0], "modules");
        expect(Array.isArray(mods)).toBe(true);
      }
    }
  });

  test("sync: switching diploma refreshes skills in new-task-template modal (no stale data, no preselection)", async () => {
    // Open class creation modal.
    await baseInit(ctx.labeler);

    // Fill required name (some controls can be disabled until the form is started).
    await fillAndTab(page.getByLabelText(/^Nom$/i), "Classe sync diplômes");

    // Derive skill codes from fixtures to avoid hardcoded strings and keep the test resilient to sample data changes
    const subskills1 = diplomaFetched?.modules?.[0]?.subSkills ?? [];
    const subskills2 = diplomaFetched2?.modules?.[0]?.subSkills ?? [];
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
      ctx.flowArgs.studentName,
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
      { withinDialog: true, timeout: 2000 },
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
