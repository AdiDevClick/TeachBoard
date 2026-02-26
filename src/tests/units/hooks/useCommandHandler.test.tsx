import { useAppStore } from "@/api/store/AppStore";
import type { SkillDto } from "@/api/types/routes/skills.types.ts";
import { API_ENDPOINTS } from "@/configs/api.endpoints.config.ts";
import type { AppModalNames } from "@/configs/app.config.ts";
import type { FetchParams } from "@/hooks/database/fetches/types/useFetch.types.ts";
import type { HandleSelectionCallbackParams } from "@/hooks/database/types/use-command-handler.types.ts";
import { renderCommandHook } from "@/tests/hooks/reusable-hooks";
import {
  moduleModal,
  skillApiEndpoint,
  skillCreated,
  skillFetchActivity,
  skillFetched,
  skillModuleModal,
  skillQueryKey,
  skillQueryKeySingle,
} from "@/tests/samples/class-creation-sample-datas";
import { testQueryClient } from "@/tests/test-utils/testQueryClient.ts";
import {
  waitForCache,
  waitForQueryKey,
} from "@/tests/test-utils/tests.functions.ts";
import { stubFetchRoutes } from "@/tests/test-utils/vitest-browser.helpers";
import { UniqueSet } from "@/utils/UniqueSet";
import { wait } from "@/utils/utils.ts";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

const click = () => new MouseEvent("click");
const baseFields: HandleSelectionCallbackParams["options"] = {
  mainFormField: "selected",
  secondaryFormField: "selectedDetailed",
};

beforeEach(() => {
  // Clear query client cache between tests
  testQueryClient.clear();
  useAppStore.setState({ lastUserActivity: new UniqueSet() });
});

afterEach(() => {
  // Restore any global fetch stubs
  vi.unstubAllGlobals();
});

describe("useCommandHandler - basic behaviours", () => {
  test("selectionCallback updates form values (array mode)", async () => {
    const { selectionCallback, form } = await renderCommandHook();

    // select value 'v1'
    selectionCallback("v1", {
      ...baseFields,
      detailedCommandItem: { label: "Label 1", isSelected: true },
    });

    expect(form.getValues("selected")).toEqual(["v1"]);
    expect(form.getValues("selectedDetailed")).toEqual([
      ["v1", { label: "Label 1", isSelected: true }],
    ]);

    // selecting same value again should remove it
    selectionCallback("v1", {
      ...baseFields,
      detailedCommandItem: { label: "Label 1", isSelected: true },
    });

    expect(form.getValues("selected")).toEqual([]);
    expect(form.getValues("selectedDetailed")).toEqual([]);
  });

  test("selectionCallback single validation mode", async () => {
    const { selectionCallback, form } = await renderCommandHook();

    selectionCallback("v1", {
      ...baseFields,
      validationMode: "single",
      detailedCommandItem: { label: "Label 1", isSelected: true },
    });

    expect(form.getValues("selected")).toBe("v1");

    // selecting another value should replace
    selectionCallback("v2", {
      ...baseFields,
      validationMode: "single",
      detailedCommandItem: { label: "Label 2", isSelected: true },
    });

    expect(form.getValues("selected")).toBe("v2");
  });

  test("selectionCallback multi selection (array mode)", async () => {
    const { selectionCallback, form } = await renderCommandHook();

    // select value 'v1'
    selectionCallback("v1", {
      ...baseFields,
      detailedCommandItem: { label: "Label 1", isSelected: true },
    });

    // select value 'v2'
    selectionCallback("v2", {
      ...baseFields,
      detailedCommandItem: { label: "Label 2", isSelected: true },
    });

    expect(form.getValues("selected")).toEqual(["v1", "v2"]);
    expect(form.getValues("selectedDetailed")).toEqual([
      ["v1", { label: "Label 1", isSelected: true }],
      ["v2", { label: "Label 2", isSelected: true }],
    ]);

    // deselect the first value only
    selectionCallback("v1", {
      ...baseFields,
      detailedCommandItem: { label: "Label 1", isSelected: true },
    });

    expect(form.getValues("selected")).toEqual(["v2"]);
    expect(form.getValues("selectedDetailed")).toEqual([
      ["v2", { label: "Label 2", isSelected: true }],
    ]);
  });

  test("resultsCallback returns cached data when queryClient has cached data", async () => {
    // seed query client with cached data using SkillDto schema
    const cached: SkillDto[] = [skillFetched];
    testQueryClient.setQueryData(skillQueryKeySingle, cached);

    const { resultsCallback, setFetchParams, rerender } =
      await renderCommandHook();

    setFetchParams((prev: FetchParams) => ({
      ...prev,
      contentId: skillFetchActivity,
      url: skillApiEndpoint,
    }));

    // Rerender to ensure state updates are applied
    rerender();

    const res = resultsCallback();

    expect(res).toEqual(cached);
  });

  test("openingCallback aborts any in-flight fetch before starting a new one", async () => {
    const hook = await renderCommandHook();
    const { openingCallback, rerender } = hook;

    // first invocation sets an abort controller
    openingCallback(true, {
      task: "foo",
      apiEndpoint: "/foo/1",
      dataReshapeFn: () => null,
    });
    rerender();

    // read fresh fetchParams from proxy
    const firstController = hook.fetchParams.abortController!;
    expect(firstController).toBeDefined();
    expect(firstController.signal.aborted).toBe(false);

    // second call should cancel the previous controller
    openingCallback(true, {
      task: "foo",
      apiEndpoint: "/foo/2",
      dataReshapeFn: () => null,
    });
    rerender();

    const secondController = hook.fetchParams.abortController!;
    expect(secondController).toBeDefined();
    expect(secondController).not.toBe(firstController);

    // clear any activity so later tests are unaffected
    useAppStore.setState({ lastUserActivity: new UniqueSet() });
  });

  test("submitCallback performs a POST and caches reshaped data (dialog flow)", async () => {
    const { submitCallback, openDialog, dialogOptions, setDialogOptions } =
      await renderCommandHook(skillModuleModal);

    const fetchDatas = {
      apiEndpoint: skillApiEndpoint,
      queryKey: skillQueryKey,
      task: skillFetchActivity,
      dataReshapeFn: (d: unknown) => ({ items: [d] }),
    };

    openDialog(click(), skillModuleModal, fetchDatas);

    // Ensure the options are visible on the dialog hook (wait for state to settle)
    await waitForQueryKey(() => dialogOptions(skillModuleModal));

    expect(dialogOptions(skillModuleModal)).toEqual({
      ...fetchDatas,
      dataReshapeFn: expect.any(Function),
    });

    // fetch to return a created object
    stubFetchRoutes({
      postRoutes: [[skillApiEndpoint, skillCreated]],
    });

    // Ensure dialog has the queryKey so fetch handler caches under expected key
    setDialogOptions(skillModuleModal, {
      queryKey: fetchDatas.queryKey,
      task: fetchDatas.task,
    });

    // Wait for setDialogOptions to apply
    await waitForQueryKey(() => dialogOptions(skillModuleModal));
    // Trigger the submission using the dialog-based flow (pass explicit endpoint and reshaper)
    submitCallback(
      { name: "new" },
      {
        endpointUrl: skillApiEndpoint,
        dataReshapeFn: (d: unknown) => ({ items: [d] }),
      },
    );

    // Wait until the queryClient has the cached reshaped data
    const cached = await waitForCache(skillQueryKey);

    expect(cached).toEqual({ items: [skillCreated] });

    // After the response the dialog should be closed
    expect(dialogOptions(skillModuleModal)).toBeUndefined();

    // The fetch flow should have recorded the last user activity in a UniqueSet.
    const lastActivity = useAppStore.getState().lastUserActivity;
    const details = lastActivity.values().next().value;

    expect(lastActivity.size).toBeGreaterThan(0);
    expect(details).toEqual(
      expect.objectContaining({
        endpoint: skillApiEndpoint,
        method: "POST",
        type: "fetch",
      }),
    );
  });

  test("openingCallback performs a GET and caches data", async () => {
    const { openingCallback, resultsCallback } =
      await renderCommandHook(moduleModal);

    const fetchDatas = {
      apiEndpoint: skillApiEndpoint,
      task: skillFetchActivity as AppModalNames,
    };

    // Stub global fetch to return items
    stubFetchRoutes({
      getRoutes: [[skillApiEndpoint, [skillFetched]]],
    });

    // Trigger the opening which should initiate a GET fetch
    openingCallback(true, {
      ...fetchDatas,
      dataReshapeFn: (d: unknown) => d,
    });

    // Wait until the queryClient has the cached fetched data
    const cached = await waitForCache(skillQueryKeySingle);

    expect(cached).toEqual([skillFetched]);
    expect(resultsCallback()).toEqual([skillFetched]);
    expect(fetch).toHaveBeenCalled();

    // The fetch flow should have recorded the last user activity in a UniqueSet
    const lastActivity = useAppStore.getState().lastUserActivity;
    const details = lastActivity.values().next().value;

    expect(lastActivity.size).toBeGreaterThan(0);
    expect(details).toEqual(
      expect.objectContaining({
        endpoint: skillApiEndpoint,
        method: "GET",
        type: "fetch",
      }),
    );
  });

  test("serverData contains business payload for CREATE_CLASS POST", async () => {
    // render the hook specifying the real create-class route and reshape
    const hook = await renderCommandHook(
      moduleModal,
      API_ENDPOINTS.POST.CREATE_CLASS.endpoint,
      API_ENDPOINTS.POST.CREATE_CLASS.dataReshape,
    );

    const { submitCallback } = hook;

    // stub the create-class POST response
    const { classCreated } =
      await import("@/tests/samples/class-creation-sample-datas");
    stubFetchRoutes({
      postRoutes: [[API_ENDPOINTS.POST.CREATE_CLASS.endpoint, classCreated]],
    });

    // perform submission using the POST method (mimicking controller)
    submitCallback(
      { name: "foo" },
      {
        endpointUrl: API_ENDPOINTS.POST.CREATE_CLASS.endpoint,
        dataReshapeFn: API_ENDPOINTS.POST.CREATE_CLASS.dataReshape,
        method: API_ENDPOINTS.POST.METHOD,
      },
    );

    // the URL may update asynchronously; poll until it matches the expected
    // endpoint (or time out).
    const start = Date.now();
    while (
      hook.fetchParams.url !== API_ENDPOINTS.POST.CREATE_CLASS.endpoint &&
      Date.now() - start < 1000
    ) {
      await wait(10);
    }

    // sanity-check that the request target was properly assigned
    expect(hook.fetchParams.url).toBe(API_ENDPOINTS.POST.CREATE_CLASS.endpoint);

    // now wait for the cache entry that corresponds to the POST
    await waitForCache([moduleModal, API_ENDPOINTS.POST.CREATE_CLASS.endpoint]);

    // degrees should propagate through serverData (re-read from proxy)
    expect(hook.serverData?.degreeLevel).toEqual(classCreated.degreeLevel);
  });
});
