import { API_ENDPOINTS } from "@/configs/api.endpoints.config.ts";
import { renderCommandHook } from "@/tests/hooks/reusable-hooks";
import {
  classCreated,
  classCreationModal,
  classesEndpoint,
  classesQueryKey,
  degreeCreated,
  degreeFetched,
  degreeFieldEndpoint,
  degreeFieldModal,
  degreeFieldQueryKey,
  degreeLevelEndpoint,
  degreeLevelModal,
  degreeLevelQueryKey,
  degreeYearEndpoint,
  degreeYearModal,
  degreeYearQueryKey,
  diplomaCreated,
  diplomaEndpoint,
  diplomaFetched,
  diplomaModal,
  diplomaQueryKey,
  stubFetchWithClassCreationItems,
  taskCreated,
  taskModal,
  tasksEndpoint,
  tasksQueryKey,
  taskTemplateCreated,
  taskTemplateModal,
  taskTemplatesEndpoint,
  taskTemplatesQueryKey,
} from "@/tests/samples/class-creation-sample-datas";
import { testQueryClient } from "@/tests/test-utils/AppTestWrapper";
import {
  click,
  getCachedItemIds,
  waitForCache,
  waitForItemsLength,
  waitForPost,
  waitForQueryKey,
} from "@/tests/test-utils/tests.functions";
import { countFetchCalls } from "@/tests/test-utils/vitest-browser.helpers";
import type { CachedGroup } from "@/tests/types/tests.types.ts";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

beforeEach(() => {
  testQueryClient.clear();
  vi.unstubAllGlobals();
  stubFetchWithClassCreationItems();
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

    const fetchDatas = {
      apiEndpoint: degreeFieldEndpoint,
      queryKey: degreeFieldQueryKey,
      task: degreeFieldModal,
      dataReshapeFn: API_ENDPOINTS.GET.DEGREES.dataReshape,
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
    await waitForItemsLength(fetchDatas.queryKey, 2);
    const updated = testQueryClient.getQueryData<CachedGroup[]>(
      fetchDatas.queryKey
    );
    expect(updated).toBeTruthy();
    const updatedGroups = updated ?? [];
    expect(updatedGroups[0].groupTitle).toBe("Tous");
    expect(updatedGroups[0].items.map((i) => i.value)).toEqual([
      degreeFetched.name,
      degreeCreated.name,
    ]);

    expect(resultsCallback()).toEqual(updatedGroups);
    expect(countFetchCalls("GET")).toBe(1);
    expect(countFetchCalls("POST")).toBe(1);
  });

  test("new-degree-item-year: GET lists, POST updates cache without extra GET", async () => {
    const { openDialog, dialogOptions, openingCallback, submitCallback } =
      await renderCommandHook(degreeYearModal);

    const fetchDatas = {
      apiEndpoint: degreeYearEndpoint,
      queryKey: degreeYearQueryKey,
      task: degreeYearModal,
      dataReshapeFn: API_ENDPOINTS.GET.DEGREES.dataReshape,
    };

    openDialog(click(), degreeYearModal, fetchDatas);
    await waitForQueryKey(() => dialogOptions(degreeYearModal));

    openingCallback(true, fetchDatas);

    await waitForCache(fetchDatas.queryKey);
    expect(countFetchCalls("GET")).toBe(1);

    submitCallback(
      { name: degreeCreated.name, code: degreeCreated.code },
      API_ENDPOINTS.POST.CREATE_DEGREE.endpoints.YEAR,
      API_ENDPOINTS.POST.CREATE_DEGREE.dataReshape
    );

    await waitForPost(1);
    await waitForItemsLength(fetchDatas.queryKey, 2);
    expect(countFetchCalls("GET")).toBe(1);
    expect(countFetchCalls("POST")).toBe(1);
  });

  test("new-degree-item-degree: GET lists, POST updates cache without extra GET", async () => {
    const { openDialog, dialogOptions, openingCallback, submitCallback } =
      await renderCommandHook(degreeLevelModal);

    const fetchDatas = {
      apiEndpoint: degreeLevelEndpoint,
      queryKey: degreeLevelQueryKey,
      task: degreeLevelModal,
      dataReshapeFn: API_ENDPOINTS.GET.DEGREES.dataReshape,
    };

    openDialog(click(), degreeLevelModal, fetchDatas);
    await waitForQueryKey(() => dialogOptions(degreeLevelModal));

    openingCallback(true, fetchDatas);

    await waitForCache(fetchDatas.queryKey);
    expect(countFetchCalls("GET")).toBe(1);

    submitCallback(
      { name: degreeCreated.name, code: degreeCreated.code },
      API_ENDPOINTS.POST.CREATE_DEGREE.endpoints.LEVEL,
      API_ENDPOINTS.POST.CREATE_DEGREE.dataReshape
    );

    await waitForPost(1);
    await waitForItemsLength(fetchDatas.queryKey, 2);
    expect(countFetchCalls("GET")).toBe(1);
    expect(countFetchCalls("POST")).toBe(1);
  });

  test("create-diploma: GET lists, POST updates cache without extra GET", async () => {
    const { openDialog, dialogOptions, openingCallback, submitCallback } =
      await renderCommandHook(diplomaModal);

    const fetchDatas = {
      apiEndpoint: diplomaEndpoint,
      queryKey: diplomaQueryKey,
      task: diplomaModal,
      dataReshapeFn: API_ENDPOINTS.GET.DIPLOMAS.dataReshape,
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
    await waitForItemsLength(fetchDatas.queryKey, 2);
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

    const fetchDatas = {
      apiEndpoint: tasksEndpoint,
      queryKey: tasksQueryKey,
      task: taskModal,
      dataReshapeFn: API_ENDPOINTS.GET.TASKS.dataReshape,
    };

    openDialog(click(), taskModal, fetchDatas);
    await waitForQueryKey(() => dialogOptions(taskModal));

    openingCallback(true, fetchDatas);

    await waitForCache(fetchDatas.queryKey);
    expect(countFetchCalls("GET")).toBe(1);

    submitCallback(
      { name: taskCreated.name, description: taskCreated.description },
      API_ENDPOINTS.POST.CREATE_TASK.endpoint,
      API_ENDPOINTS.POST.CREATE_TASK.dataReshape
    );

    await waitForPost(1);
    await waitForItemsLength(fetchDatas.queryKey, 2);
    expect(countFetchCalls("GET")).toBe(1);
    expect(countFetchCalls("POST")).toBe(1);
  });

  test("new-task-template: GET lists, POST updates cache without extra GET", async () => {
    const { openDialog, dialogOptions, openingCallback, submitCallback } =
      await renderCommandHook(taskTemplateModal);

    const fetchDatas = {
      apiEndpoint: taskTemplatesEndpoint,
      queryKey: taskTemplatesQueryKey,
      task: taskTemplateModal,
      dataReshapeFn: API_ENDPOINTS.GET.TASKSTEMPLATES.dataReshape,
    };

    openDialog(click(), taskTemplateModal, fetchDatas);
    await waitForQueryKey(() => dialogOptions(taskTemplateModal));

    openingCallback(true, fetchDatas);

    await waitForCache(fetchDatas.queryKey);
    expect(countFetchCalls("GET")).toBe(1);

    submitCallback(
      { name: "template", taskId: taskTemplateCreated.task.id },
      API_ENDPOINTS.POST.CREATE_TASK_TEMPLATE.endpoint,
      API_ENDPOINTS.POST.CREATE_TASK_TEMPLATE.dataReshape
    );

    await waitForPost(1);
    await waitForItemsLength(fetchDatas.queryKey, 2);
    expect(countFetchCalls("GET")).toBe(1);
    expect(countFetchCalls("POST")).toBe(1);
  });

  test("class-creation: GET lists, POST updates cache without extra GET", async () => {
    const { openDialog, dialogOptions, openingCallback, submitCallback } =
      await renderCommandHook(classCreationModal);

    const fetchDatas = {
      apiEndpoint: classesEndpoint,
      queryKey: classesQueryKey,
      task: classCreationModal,
      dataReshapeFn: API_ENDPOINTS.GET.CLASSES.dataReshape,
    };

    openDialog(click(), classCreationModal, fetchDatas);
    await waitForQueryKey(() => dialogOptions(classCreationModal));

    openingCallback(true, fetchDatas);

    await waitForCache(fetchDatas.queryKey);
    expect(countFetchCalls("GET")).toBe(1);

    submitCallback(
      {
        name: classCreated.name,
        description: classCreated.description,
        degreeLevel: classCreated.degreeLevel,
      },
      API_ENDPOINTS.POST.CREATE_CLASS.endpoint,
      API_ENDPOINTS.POST.CREATE_CLASS.dataReshape
    );

    await waitForPost(1);

    await expect
      .poll(
        () => {
          return getCachedItemIds(fetchDatas.queryKey).includes(
            classCreated.id
          );
        },
        { timeout: 1000 }
      )
      .toBe(true);

    const updated = testQueryClient.getQueryData<CachedGroup[]>(
      fetchDatas.queryKey
    );
    expect(countFetchCalls("GET")).toBe(1);
    expect(countFetchCalls("POST")).toBe(1);

    const group = (updated ?? []).find(
      (g) => g.groupTitle === classCreated.degreeLevel
    );
    expect(group?.items?.some((i) => i.id === classCreated.id)).toBe(true);
  });
});
