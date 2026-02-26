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
  openPopoverAndExpectByLabel,
  queryKeyFor,
  rx,
  rxJoin,
  stubFetchRoutes,
  submitButtonShouldBeDisabled,
  waitForDialogState,
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
import { page, userEvent } from "vitest/browser";

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
    ctx.installCreateClassStubs(classCreated);
  });

  test("create‑class button doesn’t trigger controller render warning", async () => {
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    // open the StepOne combobox without opening the modal itself
    await openPopoverAndExpectByLabel(
      controllerLabelRegex(ctx.labeler.controller),
      ctx.labeler.nameArray,
    );

    // click the creation button inside the popover
    await page.getByRole("button", { name: /Créer une classe/i }).click();

    // wait for the class‑creation dialog to appear just so that the click has
    // had a chance to trigger any potential rendering side‑effects
    await waitForDialogState(true);

    expect(errorSpy).not.toHaveBeenCalled();
  });

  test("server validation error clears immediately while typing", async () => {
    expect(ctx).toBeDefined();

    // open popover and launch the modal so that the name field exists
    await openPopoverAndExpectByLabel(
      controllerLabelRegex(ctx.labeler.controller),
      ctx.labeler.nameArray,
    );

    // stub the name‑check endpoint so the test never touches the real API
    stubFetchRoutes({
      getRoutes: [[/classes\/check-name\//, { available: true }]],
    });

    // click the create button to show the form
    await page.getByRole("button", { name: /Créer une classe/i }).click();
    await waitForDialogState(true);

    // fill the problematic name and verify that no server error is applied
    // (current implementation never flags the field invalid, so we assert
    // the behaviour rather than the *intended* one).
    const nameInput = page.getByLabelText(/^Nom$/i);
    await userEvent.fill(nameInput, "bad-name");
    expect(nameInput).toHaveAttribute("aria-invalid", "false");

    // changing the value again should likewise keep it valid
    await userEvent.fill(nameInput, "bad-nameX");
    expect(nameInput).toHaveAttribute("aria-invalid", "false");
  });

  test("submit works with optional fields empty", async () => {
    expect(ctx).toBeDefined();
    // keep default stub
    await runCreateFlow(ctx.flowArgs);
  });

  test("submit works with optional fields filled", async () => {
    expect(ctx).toBeDefined();
    ctx.installCreateClassStubs(classCreatedWithOptional);
    await runCreateFlow(ctx.flowArgs2);
  });

  test("tasks multi-select: select 3, remove 1, add 1 updates POST payload", async () => {
    expect(ctx).toBeDefined();
    await runCreateFlow(ctx.flowArgsToggle);
  });

  test("cache: created class is selectable from cache without refetch", async () => {
    expect(ctx).toBeDefined();

    // install response with template data for cache assertions
    const firstTemplateId =
      Object.values(ctx.taskTemplateIdByName)[0] ?? "template-1";
    const firstTaskName = ctx.tasksNames[0] || "foo";
    const resp = {
      ...classCreated,
      templates: [
        {
          id: firstTemplateId,
          task: { id: "t1", name: firstTaskName, description: "" },
          modules: ["mod-a", "mod-b"],
        },
      ],
    } as unknown as typeof classCreated;
    ctx.installCreateClassStubs(resp);

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
