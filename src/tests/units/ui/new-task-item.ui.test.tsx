import { API_ENDPOINTS } from "@/configs/api.endpoints.config.ts";
import { taskItemInputControllers } from "@/data/inputs-controllers.data";
import { AppModals } from "@/pages/AllModals/AppModals";
import { AppTestWrapper } from "@/tests/components/AppTestWrapper";
import { SamplePopoverInput } from "@/tests/components/class-creation/SamplePopoverInput";
import { taskCreated } from "@/tests/samples/class-creation-sample-datas";
import { fixtureNewTaskItem } from "@/tests/samples/ui-fixtures/class-creation.ui.fixtures";
import { setupUiTestState } from "@/tests/test-utils/class-creation/class-creation.ui.shared";
import { assertPostUpdatedCacheWithoutExtraGet } from "@/tests/test-utils/tests.functions";
import {
  checkFormValidityAndSubmit,
  countFetchCallsByUrl,
  fillFieldsEnsuringSubmitDisabled,
  queryKeyFor,
  rxExact,
  waitForDialogAndAssertText,
} from "@/tests/test-utils/vitest-browser.helpers";
import { openModalAndAssertItsOpenedAndReady } from "@/tests/units/ui/functions/useful-ui.functions";
import { afterEach, describe, test, vi } from "vitest";

const fx = fixtureNewTaskItem();
const taskController = fx.controller;
const tasksQueryKey = queryKeyFor(taskController);

setupUiTestState(
  <AppTestWrapper>
    <SamplePopoverInput
      pageId="new-task-template"
      controller={taskController}
    />
    <AppModals />
  </AppTestWrapper>,
  { beforeEach: () => fx.installFetchStubs(taskCreated) }
);

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("UI flow: new-task-item", () => {
  test("fetched items show up, add new opens modal, POST updates cache without extra GET", async () => {
    const tasks = [fx.sample.taskFetched.name, fx.sample.taskFetched2.name];
    // Open templates popover and assert existing names
    await openModalAndAssertItsOpenedAndReady(
      taskController.creationButtonText,
      {
        controller: taskController,
        nameArray: tasks,
        readyText: taskItemInputControllers[0].title,
      }
    );

    // Snapshot GET count after initial fetch (triggered by opening the popover)
    const getCallsBeforeCreation = countFetchCallsByUrl(
      taskController.apiEndpoint,
      "GET"
    );

    // await submitButtonShouldBeDisabled("Créer");
    const fills = [
      {
        label: taskItemInputControllers[0].title,
        value: "Configurer un routeur",
      },
      {
        label: taskItemInputControllers[1].title,
        value: "Une description valide.",
      },
    ];

    await fillFieldsEnsuringSubmitDisabled("Créer", fills);

    // Ensure there are no form validation alerts, then submit
    await checkFormValidityAndSubmit("Créer");

    // Ensure modal is closed and the modal title is absent
    await waitForDialogAndAssertText(/Création d'une nouvelle tâche/i, {
      present: false,
    });

    await assertPostUpdatedCacheWithoutExtraGet({
      queryKey: tasksQueryKey,
      expectedValue: taskCreated.name,
      endpoint: taskController.apiEndpoint,
      getCallsBefore: getCallsBeforeCreation,
      openPopover: { label: rxExact(taskController.label) },
      post: {
        endpoint: API_ENDPOINTS.POST.CREATE_TASK.endpoint,
        count: 1,
        timeout: 2500,
      },
    });
  });
});
