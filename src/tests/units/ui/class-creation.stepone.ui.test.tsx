import { API_ENDPOINTS } from "@/configs/api.endpoints.config.ts";
import {
  classCreationInputControllers,
  stepOneInputControllers,
} from "@/data/inputs-controllers.data";
import { AppModals } from "@/pages/AllModals/AppModals";
import {
  classCreated,
  classFetched,
  classFetched2,
  classesEndpoint,
  classesQueryKey,
  diplomaEndpoint,
  diplomaFetched,
  diplomaFetched2,
  stubFetchRoutes,
  studentFetched,
  studentFetched2,
  taskFetched,
  taskFetched2,
  taskTemplateFetch,
  tasksEndpoint,
} from "@/tests/samples/class-creation-sample-datas";
import {
  controllerLabelRegex,
  controllerTriggerRegex,
  createCommandPopoverSample,
} from "@/tests/test-utils/class-creation.ui.factories";
import {
  AppTestWrapper,
  expectPopoverToContain,
  setupUiTestState,
} from "@/tests/test-utils/class-creation.ui.shared";
import { waitForCache } from "@/tests/test-utils/tests.functions";
import {
  countFetchCallsByUrl,
  getOpenCommandContainer,
  openPopoverByLabelText,
  openPopoverByTriggerName,
  selectCommandItemInContainer,
} from "@/tests/test-utils/vitest-browser.helpers";
import { afterEach, describe, expect, test, vi } from "vitest";
import { render } from "vitest-browser-react";
import { page, userEvent } from "vitest/browser";

setupUiTestState();

afterEach(() => {
  vi.unstubAllGlobals();
});

describe.skip("UI flow: class-creation (StepOne list)", () => {
  test("list shows fetched classes, create adds a class, and list updates without extra GET", async () => {
    stubFetchRoutes({
      getRoutes: [
        [
          classesEndpoint,
          { [String(classFetched.degreeLevel)]: [classFetched, classFetched2] },
        ],
        [
          diplomaEndpoint,
          { [diplomaFetched.degreeField]: [diplomaFetched, diplomaFetched2] },
        ],
        ["/api/task-templates/by-degree-config/", taskTemplateFetch],
        [tasksEndpoint, [taskFetched, taskFetched2]],
        [
          API_ENDPOINTS.GET.STUDENTS.endpoint,
          [studentFetched, studentFetched2],
        ],
      ],
      postRoutes: [[API_ENDPOINTS.POST.CREATE_CLASS.endpoint, classCreated]],
      defaultGetPayload: [],
    });

    const stepOneClassesController = stepOneInputControllers.find(
      (c) => c.name === "classe"
    )!;

    const classDiplomasController = classCreationInputControllers.find(
      (c) => c.name === "degreeConfigId" && c.task === "create-diploma"
    )!;

    const tasksController = classCreationInputControllers.find(
      (c) => c.name === "tasks" && c.task === "new-task-template"
    )!;

    const Sample = createCommandPopoverSample({
      pageId: "class-creation",
      controller: stepOneClassesController,
    });

    render(
      <AppTestWrapper>
        <Sample />
        <AppModals />
      </AppTestWrapper>
    );

    await openPopoverByLabelText(
      controllerLabelRegex(stepOneClassesController)
    );
    await expectPopoverToContain(/1A/i);
    await expectPopoverToContain(/1B/i);

    const getCallsBeforeCreation = countFetchCallsByUrl(
      API_ENDPOINTS.GET.CLASSES.endPoints.ALL,
      "GET"
    );

    await userEvent.click(
      page.getByRole("button", { name: /Créer une classe/i })
    );
    await expect
      .element(page.getByText(/Créer une classe/i))
      .toBeInTheDocument();

    await userEvent.fill(page.getByLabelText(/^Nom$/i), "2B");
    await userEvent.tab();

    // Diploma selection (required)
    await openPopoverByLabelText(controllerLabelRegex(classDiplomasController));
    await selectCommandItemInContainer(
      getOpenCommandContainer(),
      new RegExp(`${diplomaFetched.degreeYear}`, "i")
    );

    // Task selection (required)
    await openPopoverByTriggerName(controllerTriggerRegex(tasksController));
    await selectCommandItemInContainer(
      getOpenCommandContainer(),
      new RegExp(`${taskFetched.name}`, "i")
    );

    // Students selection (required)
    const studentsAddButton = (() => {
      const labels = Array.from(document.querySelectorAll("label"));
      const studentsController = classCreationInputControllers.find(
        (c) => c.name === "students"
      )!;
      const label = labels.find((l) =>
        new RegExp(`^${studentsController.label}$`, "i").test(
          l.textContent ?? ""
        )
      );
      const container = label?.parentElement;
      const button = container?.querySelector("button");
      if (!(button instanceof HTMLElement)) {
        throw new TypeError("Students add button not found");
      }
      return button;
    })();

    await userEvent.click(studentsAddButton);
    await expect
      .element(page.getByText(/Recherche d'étudiants/i))
      .toBeInTheDocument();

    await selectCommandItemInContainer(
      getOpenCommandContainer(),
      new RegExp(
        `${studentFetched.firstName}\\s+${studentFetched.lastName}`,
        "i"
      )
    );

    const addStudents = page.getByRole("button", { name: /^Ajouter$/i });
    await expect.element(addStudents).toBeEnabled();
    await userEvent.click(addStudents);

    await expect
      .element(page.getByText(/Recherche d'étudiants/i))
      .not.toBeInTheDocument();

    await userEvent.click(
      page.getByRole("button", { name: /Créer la classe/i })
    );

    await expect
      .element(page.getByText(/Créer une classe/i))
      .not.toBeInTheDocument();

    const cached = await waitForCache(classesQueryKey);
    expect(cached).toEqual([
      {
        groupTitle: "BTS",
        items: expect.arrayContaining([
          expect.objectContaining({ id: classFetched.id }),
          expect.objectContaining({ id: classFetched2.id }),
          expect.objectContaining({ id: classCreated.id }),
        ]),
      },
    ]);

    await openPopoverByLabelText(
      controllerLabelRegex(stepOneClassesController)
    );
    await expectPopoverToContain(/2B/i);

    expect(
      countFetchCallsByUrl(API_ENDPOINTS.GET.CLASSES.endPoints.ALL, "GET")
    ).toBe(getCallsBeforeCreation);
  });
});
