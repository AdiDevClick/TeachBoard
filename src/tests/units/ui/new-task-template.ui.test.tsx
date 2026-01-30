import { API_ENDPOINTS } from "@/configs/api.endpoints.config.ts";
import { taskTemplateCreationInputControllers } from "@/features/class-creation/components/TaskTemplateCreation/forms/task-template-inputs";
import { diplomaFetchedSkills } from "@/tests/samples/class-creation-sample-datas";
import { setupUiTestState } from "@/tests/test-utils/class-creation/class-creation.ui.shared";
import {
  controllerLabelRegex,
  controllerTriggerRegex,
} from "@/tests/test-utils/class-creation/regex.functions";
import { assertPostUpdatedCacheWithoutExtraGet } from "@/tests/test-utils/tests.functions";
import {
  checkFormValidityAndSubmit,
  countFetchCallsByUrl,
  fillFieldsEnsuringSubmitDisabled,
  getLastPostJsonBodyByUrl,
  queryKeyFor,
  rx,
  rxExact,
  selectMultiplePopoversEnsuringSubmitDisabled,
  waitForDialogAndAssertText,
} from "@/tests/test-utils/vitest-browser.helpers";
import { initSetup } from "@/tests/units/ui/functions/class-creation/class-creation.functions.ts";
import { openModalAndAssertItsOpenedAndReady } from "@/tests/units/ui/functions/useful-ui.functions";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { page } from "vitest/browser";

let templatesController: any;
let skillsController: any;
let taskLabelController: any;
let templatesEndpoint: string;
let firstMainSkill: any;
let firstSubSkill: any;
let taskTemplatesByDiplomaQueryKey: any;
let sample: any;
let tasks: string[];

setupUiTestState(null, {
  beforeEach: async () => {
    const res = await initSetup(
      "createTaskTemplate",
      "templatesController",
      "class-creation",
    );

    sample = res.sample;
    ({ templatesController, skillsController, taskLabelController } =
      res.controllers);

    templatesEndpoint =
      API_ENDPOINTS.GET.TASKSTEMPLATES.endpoints.BY_DIPLOMA_ID(
        sample.diplomaFetched.id,
      );

    tasks = [sample.taskFetched.name, sample.taskFetched2.name];

    firstMainSkill = diplomaFetchedSkills[0];
    firstSubSkill = firstMainSkill.subSkills[0];
    taskTemplatesByDiplomaQueryKey = queryKeyFor({
      task: templatesController.task,
      apiEndpoint: templatesEndpoint,
    });

    res.installFetchStubs?.();
  },
});

beforeEach(() => {});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("UI flow: new-task-template", () => {
  test("fetched templates show up, add new opens modal, POST updates cache without extra GET", async () => {
    // Open templates popover and assert existing template names
    await openModalAndAssertItsOpenedAndReady(
      templatesController.creationButtonText,
      {
        controller: templatesController,
        nameArray: tasks,
        readyText: rxExact(taskLabelController.label),
      },
    );

    // Snapshot GET count after initial fetch (triggered by opening the popover)
    const getCallsBeforeCreation = countFetchCallsByUrl(
      templatesEndpoint,
      "GET",
    );

    // Fill required inputs
    const nameLabel = rx(taskTemplateCreationInputControllers[0].title!);
    const descLabel = rx(taskTemplateCreationInputControllers[1].title!);

    const fills = [
      {
        label: nameLabel,
        value: "template",
      },
      {
        label: descLabel,
        value: "Une description suffisamment longue.",
      },
    ];

    expect(page.getByLabelText(nameLabel)).toBeInTheDocument();

    await fillFieldsEnsuringSubmitDisabled("Ajouter", fills);

    await selectMultiplePopoversEnsuringSubmitDisabled("Ajouter", [
      {
        label: controllerLabelRegex(taskLabelController),
        items: rx(sample.taskFetched.name),
        withinDialog: true,
      },
      {
        label: controllerLabelRegex(skillsController),
        items: rx(firstSubSkill.code),
        withinDialog: true,
      },
    ]);

    // Ensure there are no form validation alerts, then submit
    await checkFormValidityAndSubmit("Ajouter");

    // Ensure modal is closed and the label for the task field is absent
    await waitForDialogAndAssertText(rxExact(taskLabelController.label), {
      present: false,
    });

    await assertPostUpdatedCacheWithoutExtraGet({
      queryKey: taskTemplatesByDiplomaQueryKey,
      expectedValue: sample.taskTemplateCreated.task.name,
      endpoint: templatesEndpoint,
      getCallsBefore: getCallsBeforeCreation,
      openPopover: {
        trigger: controllerTriggerRegex(templatesController),
      },
      post: {
        endpoint: API_ENDPOINTS.POST.CREATE_TASK_TEMPLATE.endpoint,
        count: 1,
        timeout: 2500,
      },
    });
  });

  test("anti-falsification: selected task/skills ids are exactly what gets POSTed", async () => {
    // Open templates popover and then open creation modal
    await openModalAndAssertItsOpenedAndReady(
      templatesController.creationButtonText,
      {
        controller: templatesController,
        nameArray: tasks,
        readyText: rxExact(taskLabelController.label),
      },
    );

    // Snapshot GET count after initial fetch (triggered by opening the popover)
    const getCallsBeforeCreation = countFetchCallsByUrl(
      templatesEndpoint,
      "GET",
    );

    const nameLabel = rx(taskTemplateCreationInputControllers[0].title!);
    const descLabel = rx(taskTemplateCreationInputControllers[1].title!);

    await fillFieldsEnsuringSubmitDisabled("Ajouter", [
      { label: nameLabel, value: "template" },
      { label: descLabel, value: "une description suffisamment longue." },
    ]);

    await selectMultiplePopoversEnsuringSubmitDisabled("Ajouter", [
      {
        label: controllerLabelRegex(taskLabelController),
        items: rx(sample.taskFetched.name),
        withinDialog: true,
      },
      {
        label: controllerLabelRegex(skillsController),
        items: rx(firstSubSkill.code),
        withinDialog: true,
      },
    ]);

    await checkFormValidityAndSubmit("Ajouter");

    await expect
      .poll(
        () =>
          getLastPostJsonBodyByUrl(
            API_ENDPOINTS.POST.CREATE_TASK_TEMPLATE.endpoint,
          ),
        { timeout: 2500 },
      )
      .toMatchObject({
        name: "template",
        description: "une description suffisamment longue.",
        degreeConfigId: sample.diplomaFetched.id,
        taskId: sample.taskFetched.id,
        modules: [
          {
            moduleId: firstMainSkill.id,
            subSkillId: [firstSubSkill.id],
          },
        ],
      });
  });
});
