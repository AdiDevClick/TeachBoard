import { API_ENDPOINTS } from "@/configs/api.endpoints.config.ts";
import { AppModals } from "@/pages/AllModals/AppModals";
import {
  stubFetchRoutes,
  taskCreated,
  taskFetched,
  taskFetched2,
  tasksEndpoint,
  tasksQueryKey,
} from "@/tests/samples/class-creation-sample-datas";
import { SamplePopoverInput } from "@/tests/test-utils/class-creation.ui.components.tsx";
import {
  taskItemInputControllers,
  taskTemplateCreationInputControllers,
} from "@/data/inputs-controllers.data";
import {
  AppTestWrapper,
  expectPopoverToContain,
  setupUiTestState,
} from "@/tests/test-utils/class-creation.ui.shared";
import { waitForCache } from "@/tests/test-utils/tests.functions";
import {
  countFetchCallsByUrl,
  openPopoverByLabelText,
} from "@/tests/test-utils/vitest-browser.helpers";
import { afterEach, describe, expect, test, vi } from "vitest";
import { render } from "vitest-browser-react";
import { page, userEvent } from "vitest/browser";

type CachedGroup<TItem> = { groupTitle: string; items: TItem[] };

setupUiTestState();

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("UI flow: new-task-item", () => {
  test("fetched items show up, add new opens modal, POST updates cache without extra GET", async () => {
    stubFetchRoutes({
      getRoutes: [[tasksEndpoint, [taskFetched, taskFetched2]]],
      postRoutes: [[API_ENDPOINTS.POST.CREATE_TASK.endpoint, taskCreated]],
      defaultGetPayload: [],
    });

    const taskController = taskTemplateCreationInputControllers.find(
      (c) => c.name === "taskId"
    )!;

    render(
      <AppTestWrapper>
        <SamplePopoverInput
          pageId="new-task-template"
          controller={taskController}
        />
        <AppModals />
      </AppTestWrapper>
    );

    await openPopoverByLabelText(new RegExp(`^${taskController.label}$`, "i"));
    await expectPopoverToContain(new RegExp(taskFetched.name, "i"));
    await expectPopoverToContain(new RegExp(taskFetched2.name, "i"));

    const getCallsBeforeCreation = countFetchCallsByUrl(
      API_ENDPOINTS.GET.TASKS.endpoint,
      "GET"
    );

    await userEvent.click(
      page.getByRole("button", { name: taskController.creationButtonText })
    );
    await expect
      .element(page.getByText(/Création d'une nouvelle tâche/i))
      .toBeInTheDocument();

    const submit = page.getByRole("button", { name: /^Créer$/i });
    await userEvent.fill(
      page.getByLabelText(taskItemInputControllers[0].title),
      "Configurer un routeur"
    );
    await userEvent.tab();
    await userEvent.fill(
      page.getByLabelText(taskItemInputControllers[1].title),
      "Une description valide."
    );
    await userEvent.tab();

    await expect.element(submit).toBeEnabled();
    await userEvent.click(submit);

    const cached = (await waitForCache(tasksQueryKey)) as Array<
      CachedGroup<{ id: string }>
    >;
    expect(cached[0]?.items.some((i) => i.id === taskCreated.id)).toBe(true);

    await openPopoverByLabelText(new RegExp(`^${taskController.label}$`, "i"));
    await expectPopoverToContain(new RegExp(taskCreated.name, "i"));

    expect(countFetchCallsByUrl(API_ENDPOINTS.GET.TASKS.endpoint, "GET")).toBe(
      getCallsBeforeCreation
    );
  });
});
