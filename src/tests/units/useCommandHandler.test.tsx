import type { SkillDto } from "@/api/types/routes/skills.types.ts";
import type { AppModalNames } from "@/configs/app.config.ts";
import type { FetchParams } from "@/hooks/database/fetches/types/useFetch.types.ts";
import type { HandleSelectionCallbackParams } from "@/hooks/database/types/use-command-handler.types.ts";
import { useAppStore } from "@/hooks/store/AppStore.ts";
import {
  skillApiEndpoint,
  skillCreated,
  skillFetchActivity,
  skillFetched,
  skillModal,
  skillModuleModal,
  skillQueryKey,
  skillQueryKeySingle,
  stubFetchWithItems,
} from "@/tests/samples/command-handler-sample-datas";
import { testQueryClient } from "@/tests/test-utils/AppTestWrapper";
import { renderCommandHook } from "@/tests/hooks/reusable-hooks";
import {
  waitForCache,
  waitForQueryKey,
} from "@/tests/test-utils/tests.functions.ts";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

const click = () => new MouseEvent("click");
const baseFields: HandleSelectionCallbackParams["options"] = {
  mainFormField: "selected",
  secondaryFormField: "selectedDetailed",
};

beforeEach(() => {
  // Clear query client cache between tests
  testQueryClient.clear();
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
      mainFormField: "selected",
      secondaryFormField: "selectedDetailed",
      detailedCommandItem: { label: "Label 1", isSelected: true },
    });

    expect(form.getValues("selected")).toEqual(["v1"]);
    expect(form.getValues("selectedDetailed")).toEqual([
      ["v1", { label: "Label 1", isSelected: true }],
    ]);

    // selecting same value again should remove it
    selectionCallback("v1", {
      mainFormField: "selected",
      secondaryFormField: "selectedDetailed",
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

  test("submitCallback performs a POST and caches reshaped data (dialog flow)", async () => {
    const { submitCallback, openDialog, dialogOptions, setDialogOptions } =
      await renderCommandHook(skillModuleModal);

    openDialog(click(), skillModuleModal, {
      apiEndpoint: skillApiEndpoint,
      queryKey: skillQueryKey,
      dataReshapeFn: (d: any) => ({ items: [d] }),
      task: skillFetchActivity,
    });

    // Ensure the options are visible on the dialog hook (wait for state to settle)
    await waitForQueryKey(() => dialogOptions(skillModuleModal));

    expect(dialogOptions(skillModuleModal)).toEqual({
      apiEndpoint: skillApiEndpoint,
      queryKey: skillQueryKey,
      dataReshapeFn: expect.any(Function),
      task: skillFetchActivity,
    });

    // fetch to return a created object
    stubFetchWithItems();

    // Ensure dialog has the queryKey so fetch handler caches under expected key
    setDialogOptions(skillModuleModal, {
      queryKey: skillQueryKey,
      task: skillFetchActivity,
    });

    // Wait for setDialogOptions to apply
    await waitForQueryKey(() => dialogOptions(skillModuleModal));
    // Trigger the submission using the dialog-based flow (pass explicit endpoint and reshaper)
    submitCallback({ name: "new" }, skillApiEndpoint, (d: any) => ({
      items: [d],
    }));

    // Wait until the queryClient has the cached reshaped data
    const cached = await waitForCache(skillQueryKey);

    expect(cached).toEqual({ items: [skillCreated] });

    // After the response the dialog should be closed
    expect(dialogOptions(skillModuleModal)).toBeUndefined();

    // The fetch flow should have recorded the last user activity
    // For dialog-based submit flow the activity is recorded against the page/modal id
    expect(useAppStore.getState().lastUserActivity).toBe(skillModuleModal);
  });

  test("openingCallback performs a GET and caches data", async () => {
    const { openingCallback, resultsCallback } = await renderCommandHook(
      skillModal
    );

    // Stub global fetch to return items
    stubFetchWithItems();

    // Trigger the opening which should initiate a GET fetch
    // Note: intentionally omit `dataReshapeFn` to match validation logic in handleOpening
    openingCallback(true, {
      task: skillFetchActivity as AppModalNames,
      apiEndpoint: skillApiEndpoint,
    });

    // Wait until the queryClient has the cached fetched data
    const cached = await waitForCache(skillQueryKeySingle);

    expect(cached).toEqual([skillFetched]);
    expect(resultsCallback()).toEqual([skillFetched]);
    expect(fetch).toHaveBeenCalled();

    // The fetch flow should have recorded the last user activity
    expect(useAppStore.getState().lastUserActivity).toBe(skillFetchActivity);
  });
});
