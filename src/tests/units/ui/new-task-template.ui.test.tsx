import { API_ENDPOINTS } from "@/configs/api.endpoints.config.ts";
import {
  classCreationInputControllers,
  taskTemplateCreationInputControllers,
} from "@/data/inputs-controllers.data.ts";
import { AppModals } from "@/pages/AllModals/AppModals";
import {
  diplomaEndpoint,
  diplomaFetched,
  diplomaFetched2,
  stubFetchRoutes,
  taskFetched,
  taskFetched2,
  tasksEndpoint,
  taskTemplateCreated,
  taskTemplateFetch,
} from "@/tests/samples/class-creation-sample-datas";
import { SamplePopoverInput } from "@/tests/test-utils/class-creation.ui.components";
import {
  controllerLabelRegex,
  controllerTriggerRegex,
  escapeRegExp,
} from "@/tests/test-utils/class-creation.ui.factories";
import {
  AppTestWrapper,
  expectPopoverToContain,
  setupUiTestState,
} from "@/tests/test-utils/class-creation.ui.shared";
import { waitForCache } from "@/tests/test-utils/tests.functions";
import {
  countFetchCallsByUrl,
  openPopoverByLabelText,
  openPopoverByTriggerName,
} from "@/tests/test-utils/vitest-browser.helpers";
import { afterEach, describe, expect, test, vi } from "vitest";
import { render } from "vitest-browser-react";
import { page, userEvent } from "vitest/browser";

type CachedGroup<TItem> = { groupTitle: string; items: TItem[] };

setupUiTestState();

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("UI flow: new-task-template", () => {
  test("fetched templates show up, add new opens modal, POST updates cache without extra GET", async () => {
    const templatesControllerBase = classCreationInputControllers.find(
      (c) => c.name === "tasks"
    )!;

    // Select a skill
    const skillsController = taskTemplateCreationInputControllers.find(
      (c) => c.name === "skills"
    )!;

    // Select a task
    const taskLabelController = taskTemplateCreationInputControllers.find(
      (c) => c.name === "taskId"
    )!;

    const templatesController = {
      ...templatesControllerBase,
      apiEndpoint: API_ENDPOINTS.GET.TASKSTEMPLATES.endpoints.BY_DIPLOMA_ID(
        diplomaFetched.id
      ),
      selectedDiploma: diplomaFetched,
    };

    stubFetchRoutes({
      getRoutes: [
        [
          diplomaEndpoint,
          { [diplomaFetched.degreeField]: [diplomaFetched, diplomaFetched2] },
        ],
        [tasksEndpoint, [taskFetched, taskFetched2]],
        [templatesController.apiEndpoint, taskTemplateFetch],
      ],
      postRoutes: [
        [API_ENDPOINTS.POST.CREATE_TASK_TEMPLATE.endpoint, taskTemplateCreated],
      ],
      defaultGetPayload: [],
    });

    render(
      <AppTestWrapper>
        <AppModals />
        <SamplePopoverInput
          pageId="class-creation"
          controller={templatesController}
          options={{ selectedDiploma: diplomaFetched }}
        />
      </AppTestWrapper>
    );

    // Open templates popover and assert existing template names
    await openPopoverByTriggerName(controllerTriggerRegex(templatesController));
    const tasks = [taskFetched.name, taskFetched2.name];
    for (const t of tasks) await expectPopoverToContain(new RegExp(t, "i"));

    // Open creation modal
    await userEvent.click(
      page.getByRole("button", {
        name: templatesController.creationButtonText,
      })
    );

    // Wait for modal to be open
    await expect
      .poll(
        () =>
          document.querySelector(
            '[data-slot="dialog-content"][data-state="open"]'
          ) !== null,
        { timeout: 1000 }
      )
      .toBe(true);

    // Fill required inputs
    const nameLabel = new RegExp(
      taskTemplateCreationInputControllers[0].title!,
      "i"
    );
    const descLabel = new RegExp(
      taskTemplateCreationInputControllers[1].title!,
      "i"
    );

    await expect.element(page.getByLabelText(nameLabel)).toBeInTheDocument();
    await userEvent.fill(page.getByLabelText(nameLabel), "template");
    await userEvent.tab();
    await userEvent.fill(
      page.getByLabelText(descLabel),
      "Une description suffisamment longue."
    );
    await userEvent.tab();

    await openPopoverByLabelText(controllerLabelRegex(taskLabelController), {
      withinDialog: true,
      items: new RegExp(taskFetched.name, "i"),
    });
    await userEvent.tab();

    const subSkillCodes = (diplomaFetched.skills ?? []).flatMap((s) =>
      s.subSkills.map((ss) => ss.code)
    );
    await openPopoverByLabelText(controllerLabelRegex(skillsController), {
      withinDialog: true,
      items: new RegExp(subSkillCodes[0], "i"),
    });
    await userEvent.tab();

    const taskTemplatesByDiplomaQueryKey = [
      "new-task-template",
      templatesController.apiEndpoint,
    ] as const;

    const getCallsBeforeCreation = countFetchCallsByUrl(
      templatesController.apiEndpoint,
      "GET"
    );

    const submit = page.getByRole("button", { name: /^Ajouter$/i });
    await expect
      .poll(
        () =>
          Array.from(document.querySelectorAll('[role="alert"]'))
            .map((n) => n.textContent ?? "")
            .filter(Boolean),
        { timeout: 500 }
      )
      .toEqual([]);
    await expect.element(submit).toBeEnabled();
    await userEvent.click(submit);

    // Modal closed
    await expect
      .element(
        page.getByLabelText(
          new RegExp(`^${escapeRegExp(taskLabelController.label)}$`, "i")
        )
      )
      .not.toBeInTheDocument();

    const cached = (await waitForCache(
      taskTemplatesByDiplomaQueryKey
    )) as Array<CachedGroup<{ id: string }>>;
    expect(cached[0]?.items.some((i) => i.id === taskTemplateCreated.id)).toBe(
      true
    );

    await openPopoverByTriggerName(controllerTriggerRegex(templatesController));
    await expectPopoverToContain(new RegExp(taskTemplateCreated.task.name, "i"));

    expect(countFetchCallsByUrl(templatesController.apiEndpoint, "GET")).toBe(
      getCallsBeforeCreation
    );
  });
});
