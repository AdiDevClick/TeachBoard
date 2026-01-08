import { API_ENDPOINTS } from "@/configs/api.endpoints.config.ts";
import { taskTemplateCreationInputControllers } from "@/data/inputs-controllers.data.ts";
import { AppModals } from "@/pages/AllModals/AppModals";
import { AppTestWrapper } from "@/tests/components/AppTestWrapper";
import { SamplePopoverInput } from "@/tests/components/class-creation/SamplePopoverInput";
import { diplomaFetchedSkills } from "@/tests/samples/class-creation-sample-datas";
import { fixtureNewTaskTemplate } from "@/tests/samples/ui-fixtures/class-creation.ui.fixtures";
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
  submitButtonShouldBeDisabled,
  waitForDialogAndAssertText,
} from "@/tests/test-utils/vitest-browser.helpers";
import { openModalAndAssertItsOpenedAndReady } from "@/tests/units/ui/functions/useful-ui.functions";
import { afterEach, describe, expect, test, vi } from "vitest";
import { page } from "vitest/browser";

const fx = fixtureNewTaskTemplate();
const { templatesController, skillsController, taskLabelController } =
  fx.controllers;

const firstMainSkill = diplomaFetchedSkills[0];
const firstSubSkill = firstMainSkill.subSkills[0];
const taskTemplatesByDiplomaQueryKey = queryKeyFor(templatesController);

setupUiTestState(
  <AppTestWrapper>
    <AppModals />
    <SamplePopoverInput
      pageId="class-creation"
      controller={templatesController}
      options={{ selectedDiploma: fx.sample.diplomaFetched }}
    />
  </AppTestWrapper>,
  { beforeEach: fx.installFetchStubs }
);

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
        nameArray: [fx.sample.taskFetched.name, fx.sample.taskFetched2.name],
        readyText: rxExact(taskLabelController.label),
      }
    );

    // Snapshot GET count after initial fetch (triggered by opening the popover)
    const getCallsBeforeCreation = countFetchCallsByUrl(
      templatesController.apiEndpoint,
      "GET"
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

    await expect(page.getByLabelText(nameLabel)).toBeInTheDocument();

    await submitButtonShouldBeDisabled("Ajouter");

    await fillFieldsEnsuringSubmitDisabled("Ajouter", fills);

    await selectMultiplePopoversEnsuringSubmitDisabled("Ajouter", [
      {
        label: controllerLabelRegex(taskLabelController),
        items: rx(fx.sample.taskFetched.name),
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
      expectedValue: fx.sample.taskTemplateCreated.task.name,
      endpoint: templatesController.apiEndpoint,
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
    const tasks = [fx.sample.taskFetched.name, fx.sample.taskFetched2.name];
    // Open templates popover and then open creation modal
    await openModalAndAssertItsOpenedAndReady(
      templatesController.creationButtonText,
      {
        controller: templatesController,
        nameArray: tasks,
        readyText: rxExact(taskLabelController.label),
      }
    );

    // Snapshot GET count after initial fetch (triggered by opening the popover)
    const getCallsBeforeCreation = countFetchCallsByUrl(
      templatesController.apiEndpoint,
      "GET"
    );

    const nameLabel = rx(taskTemplateCreationInputControllers[0].title!);
    const descLabel = rx(taskTemplateCreationInputControllers[1].title!);

    // await submitButtonShouldBeDisabled("Ajouter");

    await fillFieldsEnsuringSubmitDisabled("Ajouter", [
      { label: nameLabel, value: "template" },
      { label: descLabel, value: "une description suffisamment longue." },
    ]);

    await selectMultiplePopoversEnsuringSubmitDisabled("Ajouter", [
      {
        label: controllerLabelRegex(taskLabelController),
        items: rx(fx.sample.taskFetched.name),
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
            API_ENDPOINTS.POST.CREATE_TASK_TEMPLATE.endpoint
          ),
        { timeout: 2500 }
      )
      .toMatchObject({
        name: "template",
        description: "une description suffisamment longue.",
        degreeConfigId: fx.sample.diplomaFetched.id,
        taskId: fx.sample.taskFetched.id,
        skills: [
          {
            mainSkill: firstMainSkill.mainSkillId,
            subSkillId: [firstSubSkill.id],
          },
        ],
      });
  });
});
