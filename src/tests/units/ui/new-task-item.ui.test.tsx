import { API_ENDPOINTS } from "@/configs/api.endpoints.config.ts";
import { taskItemInputControllers } from "@/features/class-creation/components/TaskItem/forms/task-item-inputs";
import { taskCreated } from "@/tests/samples/class-creation-sample-datas";
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
import { initSetup } from "@/tests/units/ui/functions/class-creation/class-creation.functions.ts";
import { openModalAndAssertItsOpenedAndReady } from "@/tests/units/ui/functions/useful-ui.functions";
import { afterEach, describe, test, vi } from "vitest";
import { page } from "vitest/browser";

let taskController: any;
let tasksQueryKey: any;
let sample: any;

setupUiTestState(null, {
  beforeEach: async () => {
    const res = await initSetup(
      "createTaskItem",
      "taskLabelController",
      "new-task-template",
    );

    taskController = res.controllers.taskLabelController;
    tasksQueryKey = queryKeyFor(taskController);

    sample = res.sample;

    res.installFetchStubs?.(taskCreated);
  },
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("UI flow: new-task-item", () => {
  test("fetched items show up, add new opens modal, POST updates cache without extra GET", async () => {
    const tasks = [sample.taskFetched.name, sample.taskFetched2.name];
    // Open templates popover and assert existing names
    await openModalAndAssertItsOpenedAndReady(
      taskController.creationButtonText,
      {
        controller: taskController,
        nameArray: tasks,
        readyText: taskItemInputControllers[0].title,
      },
    );

    // Snapshot GET count after initial fetch (triggered by opening the popover)
    const getCallsBeforeCreation = countFetchCallsByUrl(
      taskController.apiEndpoint,
      "GET",
    );

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

  test("description : un caract\u00e8re invalide d\u00e9clenche l'erreur, l'ajout de caract\u00e8res la maintient, une valeur valide la supprime et permet la soumission", async () => {
    const tasks = [sample.taskFetched.name, sample.taskFetched2.name];
    // Open modal
    await openModalAndAssertItsOpenedAndReady(
      taskController.creationButtonText,
      {
        controller: taskController,
        nameArray: tasks,
        readyText: taskItemInputControllers[0].title,
      },
    );

    const descInput = page.getByRole("textbox", {
      name: taskItemInputControllers[1].title,
    });

    await fillFieldsEnsuringSubmitDisabled("Créer", [
      // Step 1+2 : bad char → aria-invalid="true"
      {
        locator: descInput,
        value: "<bad chars here!!",
        assertAttribute: "aria-invalid",
        toBe: "true",
      },
      // Step 3+4+5 : append chars → error persists -> submit disabled
      {
        locator: descInput,
        value: "<bad chars here!! extra content ajout\u00e9",
        assertAttribute: "aria-invalid",
        toBe: "true",
      },
      // Step 6 : valid value → aria-invalid="false" + submit disabled
      {
        locator: descInput,
        value: "Une description valide et suffisamment longue.",
        assertAttribute: "aria-invalid",
        toBe: "false",
      },
      // Step 7 : clear errors -> aria-invalid="true" (not optional)
      {
        locator: descInput,
        assertAttribute: "aria-invalid",
        toBe: "true",
        clearInput: true,
      },
    ]);
  });
});
