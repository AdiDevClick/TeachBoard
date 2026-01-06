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
  openPopoverAndExpectByTrigger,
  queryKeyFor,
  rx,
  rxExact,
  selectMultiplePopoversEnsuringSubmitDisabled,
  submitButtonShouldBeDisabled,
  waitForDialogAndAssertText,
  waitForDialogState,
} from "@/tests/test-utils/vitest-browser.helpers";
import { afterEach, describe, expect, test, vi } from "vitest";
import { page, userEvent } from "vitest/browser";

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
    await openPopoverAndExpectByTrigger(
      controllerTriggerRegex(templatesController),
      [fx.sample.taskFetched.name, fx.sample.taskFetched2.name]
    );

    // Snapshot GET count after initial fetch (triggered by opening the popover)
    const getCallsBeforeCreation = countFetchCallsByUrl(
      templatesController.apiEndpoint,
      "GET"
    );

    // Open creation modal
    await userEvent.click(
      page.getByRole("button", {
        name: templatesController.creationButtonText,
      })
    );

    // Wait for modal to be open
    await waitForDialogState(true, 1000);

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

    await expect.element(page.getByLabelText(nameLabel)).toBeInTheDocument();

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
    });
  });

  test("anti-falsification: selected task/skills ids are exactly what gets POSTed", async () => {
    // Open templates popover and then open creation modal
    await openPopoverAndExpectByTrigger(
      controllerTriggerRegex(templatesController),
      [fx.sample.taskFetched.name, fx.sample.taskFetched2.name]
    );

    await userEvent.click(
      page.getByRole("button", {
        name: templatesController.creationButtonText,
      })
    );
    await waitForDialogState(true, 1000);

    const nameLabel = rx(taskTemplateCreationInputControllers[0].title!);
    const descLabel = rx(taskTemplateCreationInputControllers[1].title!);

    await submitButtonShouldBeDisabled("Ajouter");

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
