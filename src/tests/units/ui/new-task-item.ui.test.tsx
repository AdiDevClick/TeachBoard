import { taskItemInputControllers } from "@/data/inputs-controllers.data";
import { AppModals } from "@/pages/AllModals/AppModals";
import { AppTestWrapper } from "@/tests/components/AppTestWrapper";
import { SamplePopoverInput } from "@/tests/components/class-creation/SamplePopoverInput";
import {
  taskCreated,
  taskFetched,
  taskFetched2,
} from "@/tests/samples/class-creation-sample-datas";
import { fixtureNewTaskItem } from "@/tests/samples/ui-fixtures/class-creation.ui.fixtures";
import { setupUiTestState } from "@/tests/test-utils/class-creation/class-creation.ui.shared";
import { assertPostUpdatedCacheWithoutExtraGet } from "@/tests/test-utils/tests.functions";
import {
  checkFormValidityAndSubmit,
  countFetchCallsByUrl,
  fillFieldsEnsuringSubmitDisabled,
  openPopoverAndExpectByLabel,
  queryKeyFor,
  rxExact,
  submitButtonShouldBeDisabled,
  waitForDialogAndAssertText,
} from "@/tests/test-utils/vitest-browser.helpers";
import { afterEach, describe, test, vi } from "vitest";
import { page, userEvent } from "vitest/browser";

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
    // Open templates popover and assert existing names
    await openPopoverAndExpectByLabel(rxExact(taskController.label), [
      taskFetched.name,
      taskFetched2.name,
    ]);

    // Snapshot GET count after initial fetch (triggered by opening the popover)
    const getCallsBeforeCreation = countFetchCallsByUrl(
      taskController.apiEndpoint,
      "GET"
    );

    // Open creation modal
    await userEvent.click(
      page.getByRole("button", { name: taskController.creationButtonText })
    );

    // Ensure modal is opened and title is present
    await waitForDialogAndAssertText(taskItemInputControllers[0].title, {
      present: true,
    });

    await submitButtonShouldBeDisabled("Créer");

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
    });
  });
});
