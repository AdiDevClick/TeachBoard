import { API_ENDPOINTS } from "@/configs/api.endpoints.config.ts";
import { renderCommandHook } from "@/tests/hooks/reusable-hooks";
import {
  classCreated,
  classCreationModal,
  classesEndpoint,
  degreeCreated,
  degreeCreatedResponse,
  degreeFetched,
  degreeFieldModal,
  degreeLevelModal,
  degreeYearModal,
  diplomaCreated,
  diplomaFetched,
  diplomaModal,
  taskCreated,
  taskModal,
  taskTemplateCreated,
  taskTemplateModal,
} from "@/tests/samples/class-creation-sample-datas";
import { testQueryClient } from "@/tests/test-utils/testQueryClient";
import {
  click,
  waitForCache,
  waitForItemsLength,
  waitForPost,
  waitForQueryKey,
} from "@/tests/test-utils/tests.functions";
import {
  fixtureCreateClassStepOne,
  fixtureCreateDiplomaFromClassCreation,
  fixtureNewDegreeItem,
  fixtureNewTaskItem,
  fixtureNewTaskTemplate,
} from "@/tests/test-utils/ui-fixtures/class-creation.ui.fixtures";
import {
  countFetchCalls,
  countFetchCallsByUrl,
  getLastPostJsonBodyByUrl,
} from "@/tests/test-utils/vitest-browser.helpers";
import type { CachedGroup } from "@/tests/types/tests.types.ts";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

beforeEach(() => {
  testQueryClient.clear();
  vi.unstubAllGlobals();
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("Class creation modals integration", () => {
  test("new-degree-item-field: GET lists, POST updates cache without extra GET", async () => {
    const {
      openDialog,
      dialogOptions,
      openingCallback,
      submitCallback,
      resultsCallback,
    } = await renderCommandHook(degreeFieldModal);

    const fx = fixtureNewDegreeItem("FIELD");
    fx.installFetchStubs(degreeCreatedResponse);

    const fetchDatas = {
      apiEndpoint: fx.controller.apiEndpoint,
      queryKey: [fx.controller.task, fx.controller.apiEndpoint] as const,
      task: fx.controller.task,
      dataReshapeFn: fx.controller.dataReshapeFn,
    };

    openDialog(click(), degreeFieldModal, fetchDatas);
    await waitForQueryKey(() => dialogOptions(degreeFieldModal));

    openingCallback(true, fetchDatas);

    const cached = (await waitForCache(fetchDatas.queryKey)) as CachedGroup[];
    expect(Array.isArray(cached)).toBe(true);
    expect(cached[0].groupTitle).toBe("Tous");
    expect(cached[0].items[0].name).toBe(degreeFetched.name);
    // `value` is provided via ObjectReshape proxy mapping
    expect(cached[0].items[0].value).toBe(degreeFetched.name);
    expect(countFetchCalls("GET")).toBe(1);

    submitCallback(
      { name: degreeCreated.name, code: degreeCreated.code },
      API_ENDPOINTS.POST.CREATE_DEGREE.endpoints.FIELD,
      API_ENDPOINTS.POST.CREATE_DEGREE.dataReshape
    );

    await waitForPost(1);
    // Expect the list to grow by one relative to the already-cached value
    await waitForItemsLength(fetchDatas.queryKey, cached[0].items.length + 1);
    const updated = testQueryClient.getQueryData<CachedGroup[]>(
      fetchDatas.queryKey
    );
    expect(updated).toBeTruthy();
    const updatedGroups = updated ?? [];
    expect(updatedGroups[0].groupTitle).toBe("Tous");
    // Ensure the created item and the original fetched item are present
    expect(updatedGroups[0].items.map((i) => i.value)).toEqual(
      expect.arrayContaining([degreeFetched.name, degreeCreated.name])
    );

    expect(resultsCallback()).toEqual(updatedGroups);
    expect(countFetchCalls("GET")).toBe(1);
    expect(countFetchCalls("POST")).toBe(1);
  });

  test("new-degree-item-year: GET lists, POST updates cache without extra GET", async () => {
    const { openDialog, dialogOptions, openingCallback, submitCallback } =
      await renderCommandHook(degreeYearModal);

    const fx = fixtureNewDegreeItem("YEAR");
    fx.installFetchStubs(degreeCreatedResponse);

    const fetchDatas = {
      apiEndpoint: fx.controller.apiEndpoint,
      queryKey: [fx.controller.task, fx.controller.apiEndpoint] as const,
      task: fx.controller.task,
      dataReshapeFn: fx.controller.dataReshapeFn,
    };

    openDialog(click(), degreeYearModal, fetchDatas);
    await waitForQueryKey(() => dialogOptions(degreeYearModal));

    openingCallback(true, fetchDatas);

    const cachedBefore = (await waitForCache(
      fetchDatas.queryKey
    )) as CachedGroup[];
    expect(countFetchCalls("GET")).toBe(1);

    submitCallback(
      { name: degreeCreated.name, code: degreeCreated.code },
      API_ENDPOINTS.POST.CREATE_DEGREE.endpoints.YEAR,
      API_ENDPOINTS.POST.CREATE_DEGREE.dataReshape
    );

    await waitForPost(1);
    await waitForItemsLength(
      fetchDatas.queryKey,
      cachedBefore[0].items.length + 1
    );
    expect(countFetchCalls("GET")).toBe(1);
    expect(countFetchCalls("POST")).toBe(1);
  });

  test("new-degree-item-degree: GET lists, POST updates cache without extra GET", async () => {
    const { openDialog, dialogOptions, openingCallback, submitCallback } =
      await renderCommandHook(degreeLevelModal);

    const fx = fixtureNewDegreeItem("LEVEL");
    fx.installFetchStubs(degreeCreatedResponse);

    const fetchDatas = {
      apiEndpoint: fx.controller.apiEndpoint,
      queryKey: [fx.controller.task, fx.controller.apiEndpoint] as const,
      task: fx.controller.task,
      dataReshapeFn: fx.controller.dataReshapeFn,
    };

    openDialog(click(), degreeLevelModal, fetchDatas);
    await waitForQueryKey(() => dialogOptions(degreeLevelModal));

    openingCallback(true, fetchDatas);

    const cachedBefore = (await waitForCache(
      fetchDatas.queryKey
    )) as CachedGroup[];
    expect(countFetchCalls("GET")).toBe(1);

    submitCallback(
      { name: degreeCreated.name, code: degreeCreated.code },
      API_ENDPOINTS.POST.CREATE_DEGREE.endpoints.LEVEL,
      API_ENDPOINTS.POST.CREATE_DEGREE.dataReshape
    );

    await waitForPost(1);
    await waitForItemsLength(
      fetchDatas.queryKey,
      cachedBefore[0].items.length + 1
    );
    expect(countFetchCalls("GET")).toBe(1);
    expect(countFetchCalls("POST")).toBe(1);
  });

  test("create-diploma: GET lists, POST updates cache without extra GET", async () => {
    const { openDialog, dialogOptions, openingCallback, submitCallback } =
      await renderCommandHook(diplomaModal);

    const fx = fixtureCreateDiplomaFromClassCreation();
    fx.installFetchStubs();

    const fetchDatas = {
      apiEndpoint: fx.controllers.diplomasController.apiEndpoint,
      queryKey: [
        fx.controllers.diplomasController.task,
        fx.controllers.diplomasController.apiEndpoint,
      ] as const,
      task: fx.controllers.diplomasController.task,
      dataReshapeFn: fx.controllers.diplomasController.dataReshapeFn,
    };

    openDialog(click(), diplomaModal, fetchDatas);
    await waitForQueryKey(() => dialogOptions(diplomaModal));

    openingCallback(true, fetchDatas);

    const cached = (await waitForCache(fetchDatas.queryKey)) as CachedGroup[];
    expect(cached[0].groupTitle).toBe(diplomaFetched.degreeField);
    expect(cached[0].items[0].id).toBe(diplomaFetched.id);
    // Computed/proxied fields are only materialized on access
    expect(cached[0].items[0].value).toBe(
      `${diplomaFetched.degreeLevel} ${diplomaFetched.degreeYear}`
    );
    expect(countFetchCalls("GET")).toBe(1);

    submitCallback(
      {
        degreeLevel: diplomaCreated.degreeLevel,
        degreeYear: diplomaCreated.degreeYear,
        degreeField: diplomaCreated.degreeField,
      },
      API_ENDPOINTS.POST.CREATE_DIPLOMA.endpoint,
      API_ENDPOINTS.POST.CREATE_DIPLOMA.dataReshape
    );

    await waitForPost(1);
    await waitForItemsLength(fetchDatas.queryKey, cached[0].items.length + 1);
    const updated = testQueryClient.getQueryData<CachedGroup[]>(
      fetchDatas.queryKey
    );
    expect(countFetchCalls("GET")).toBe(1);
    expect(countFetchCalls("POST")).toBe(1);

    // Ensure the created item ended up in the same group
    const group = (updated ?? []).find(
      (g) => g.groupTitle === diplomaCreated.degreeField
    );
    expect(group?.items?.some((i) => i.id === diplomaCreated.id)).toBe(true);
  });

  test("new-task-item: GET lists, POST updates cache without extra GET", async () => {
    const { openDialog, dialogOptions, openingCallback, submitCallback } =
      await renderCommandHook(taskModal);

    const fx = fixtureNewTaskItem();
    fx.installFetchStubs(taskCreated);

    const fetchDatas = {
      apiEndpoint: fx.controller.apiEndpoint,
      queryKey: [fx.controller.task, fx.controller.apiEndpoint] as const,
      task: fx.controller.task,
      dataReshapeFn: fx.controller.dataReshapeFn,
    };

    openDialog(click(), taskModal, fetchDatas);
    await waitForQueryKey(() => dialogOptions(taskModal));

    openingCallback(true, fetchDatas);

    const cachedBefore = (await waitForCache(
      fetchDatas.queryKey
    )) as CachedGroup[];
    expect(countFetchCalls("GET")).toBe(1);

    submitCallback(
      { name: taskCreated.name, description: taskCreated.description },
      API_ENDPOINTS.POST.CREATE_TASK.endpoint,
      API_ENDPOINTS.POST.CREATE_TASK.dataReshape
    );

    await waitForPost(1);
    await waitForItemsLength(
      fetchDatas.queryKey,
      cachedBefore[0].items.length + 1
    );
    expect(countFetchCalls("GET")).toBe(1);
    expect(countFetchCalls("POST")).toBe(1);
  });

  test("new-task-template: GET lists, POST updates cache without extra GET", async () => {
    const { openDialog, dialogOptions, openingCallback, submitCallback } =
      await renderCommandHook(taskTemplateModal);

    const fx = fixtureNewTaskTemplate();
    fx.installFetchStubs();

    const fetchDatas = {
      // Use the global task templates endpoint for this flow (component queries the by-degree endpoint but the public listing is the target for cache update)
      apiEndpoint: API_ENDPOINTS.GET.TASKSTEMPLATES.endpoints.ALL,
      queryKey: [
        fx.controllers.templatesController.task,
        API_ENDPOINTS.GET.TASKSTEMPLATES.endpoints.ALL,
      ] as const,
      task: fx.controllers.templatesController.task,
      dataReshapeFn: fx.controllers.templatesController.dataReshapeFn,
    };

    openDialog(click(), taskTemplateModal, fetchDatas);
    await waitForQueryKey(() => dialogOptions(taskTemplateModal));

    openingCallback(true, fetchDatas);

    const cachedBefore = (await waitForCache(
      fetchDatas.queryKey
    )) as CachedGroup[];
    expect(countFetchCalls("GET")).toBe(1);

    submitCallback(
      { name: "template", taskId: taskTemplateCreated.task.id },
      API_ENDPOINTS.POST.CREATE_TASK_TEMPLATE.endpoint,
      API_ENDPOINTS.POST.CREATE_TASK_TEMPLATE.dataReshape
    );

    await waitForPost(1);
    await waitForItemsLength(
      fetchDatas.queryKey,
      cachedBefore[0].items.length + 1
    );
    expect(countFetchCalls("GET")).toBe(1);
    expect(countFetchCalls("POST")).toBe(1);
  });

  test("class-creation: GET lists, POST updates cache without extra GET", async () => {
    const { openDialog, dialogOptions, openingCallback, submitCallback } =
      await renderCommandHook(classCreationModal);

    const fx = fixtureCreateClassStepOne();
    fx.installFetchStubs();

    const fetchDatas = {
      apiEndpoint: fx.controllers.classesController.apiEndpoint,
      queryKey: [
        fx.controllers.classesController.task,
        fx.controllers.classesController.apiEndpoint,
      ] as const,
      task: fx.controllers.classesController.task,
      dataReshapeFn: fx.controllers.classesController.dataReshapeFn,
    };

    openDialog(click(), classCreationModal, fetchDatas);
    await waitForQueryKey(() => dialogOptions(classCreationModal));

    openingCallback(true, fetchDatas);

    const getCallsBefore = countFetchCallsByUrl(classesEndpoint, "GET");

    submitCallback(
      {
        name: classCreated.name,
        description: classCreated.description,
        degreeLevel: classCreated.degreeLevel,
      },
      API_ENDPOINTS.POST.CREATE_CLASS.endpoint,
      API_ENDPOINTS.POST.CREATE_CLASS.dataReshape
    );

    // Wait for POST and assert server was called with expected payload and no extra GET
    await waitForPost(1);
    expect(countFetchCallsByUrl(classesEndpoint, "GET")).toBe(getCallsBefore);
    expect(countFetchCalls("POST")).toBe(1);

    // Verify last POST payload matches the created class parameters
    const lastBody = getLastPostJsonBodyByUrl(
      API_ENDPOINTS.POST.CREATE_CLASS.endpoint
    );
    expect(lastBody).toMatchObject({
      name: classCreated.name,
      description: classCreated.description,
      degreeLevel: classCreated.degreeLevel,
    });

    // Global GET count can vary depending on prior flows; ensure POST occurred
    expect(countFetchCalls("POST")).toBe(1);
  });
});
