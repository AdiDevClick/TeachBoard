import { useAppStore } from "@/api/store/AppStore";
import type { AppModalNames } from "@/configs/app.config.ts";
import { renderCommandHook } from "@/tests/hooks/reusable-hooks";
import {
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
  click,
  waitForCache,
  waitForQueryKey,
} from "@/tests/test-utils/tests.functions";
import { stubFetchRoutes } from "@/tests/test-utils/vitest-browser.helpers";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";

beforeEach(() => {
  testQueryClient.clear();
  vi.unstubAllGlobals();
});

afterEach(() => {
  vi.unstubAllGlobals();
});
// Minimal integration-style test for DegreeModuleSkill modal
describe("DegreeModuleSkill modal integration", () => {
  test("opens, lists fetched items, POST updates cache and tags sync", async () => {
    const {
      openDialog,
      dialogOptions,
      setDialogOptions,
      submitCallback,
      resultsCallback,
    } = await renderCommandHook(skillModuleModal);

    const fetchDatas = {
      apiEndpoint: skillApiEndpoint,
      queryKey: skillQueryKey,
      dataReshapeFn: (d: unknown) => ({ items: d }),
      task: skillFetchActivity as AppModalNames,
    };

    // Open dialog with fetch settings
    openDialog(click(), skillModuleModal, fetchDatas);

    // Wait until dialog has options
    await waitForQueryKey(() => dialogOptions(skillModuleModal));

    // Stub fetch to return one fetched item on GET and a created one on POST
    stubFetchRoutes({
      getRoutes: [[skillApiEndpoint, [skillFetched]]],
      postRoutes: [[skillApiEndpoint, skillCreated]],
    });

    // Trigger opening fetch via the opening callback to emulate the internal command opening
    const { openingCallback } = await renderCommandHook();
    openingCallback(true, {
      task: fetchDatas.task,
      apiEndpoint: fetchDatas.apiEndpoint,
    });

    // Wait for cache to contain fetched items (activity-based key)
    const cached = await waitForCache(skillQueryKeySingle);
    expect(cached).toEqual([skillFetched]);

    // Now prepare dialog options for submit flow and ensure the queryKey is present
    setDialogOptions(skillModuleModal, {
      queryKey: fetchDatas.queryKey,
      task: fetchDatas.task,
    });
    await waitForQueryKey(() => dialogOptions(skillModuleModal));

    // Now submit a new skill via submitCallback which should POST and reshaped cache
    submitCallback(
      { name: "new" },
      {
        endpointUrl: fetchDatas.apiEndpoint,
        dataReshapeFn: (d: unknown) => ({ items: [d] }),
      }
    );

    const newCached = await waitForCache(fetchDatas.queryKey);
    expect(newCached).toEqual({ items: [skillCreated] });

    // Verify lastUserActivity
    expect(useAppStore.getState().lastUserActivity).toBe(skillModuleModal);

    // Results callback should return list
    expect(resultsCallback()).toEqual({ items: [skillCreated] });
  });

  test("form validation works via zod schema", async () => {
    const moduleSkill = await import("@/models/degree-module-skill.model.ts");

    // Invalid payload
    const invalid = { name: "", code: "" };
    expect(moduleSkill.default.safeParse(invalid).success).toBe(false);

    // Valid payload
    const valid = { name: "Valid Name", code: "VC1" };
    expect(moduleSkill.default.safeParse(valid).success).toBe(true);
  });

  test("newItemCallback opens the modal with expected options", async () => {
    const { newItemCallback, dialogOptions } = await renderCommandHook();

    const fetchDatas = {
      apiEndpoint: skillApiEndpoint,
      queryKey: skillQueryKey,
      task: skillModuleModal,
    };

    newItemCallback({
      apiEndpoint: fetchDatas.apiEndpoint,
      task: fetchDatas.task,
    });

    await waitForQueryKey(() => dialogOptions(skillModuleModal));

    expect(dialogOptions(skillModuleModal)).toEqual({
      apiEndpoint: fetchDatas.apiEndpoint,
      queryKey: [fetchDatas.task, fetchDatas.apiEndpoint],
      task: fetchDatas.task,
    });
  });
});
