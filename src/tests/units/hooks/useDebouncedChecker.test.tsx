import { useDebouncedChecker } from "@/features/class-creation/components/main/hooks/useDebouncedChecker";
import { AppTestWrapper } from "@/tests/components/AppTestWrapper";
import getHookResults from "@/tests/test-utils/getHookResults";
import { act } from "react";
import { useForm } from "react-hook-form";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { renderHook } from "vitest-browser-react";

// we will stub the fetch hook so that the test harness can manipulate its
// state freely.  the production hook uses useFetch internally; monkey‑patching
// here keeps the tests lightweight and focused on our own logic.
const fakeFetch: any = {
  error: {},
  fetchParams: { url: "", filters: {} },
  setFetchParams: vi.fn(),
  onSubmit: vi.fn(),
};

vi.mock("@/hooks/database/fetches/useFetch", () => ({
  useFetch: () => fakeFetch,
}));

// helper used by tests to build a synthetic change event
function makeEvent(value: string) {
  return {
    preventDefault: () => {},
    stopPropagation: () => {},
    target: { value },
  } as unknown as React.ChangeEvent<HTMLInputElement>;
}

const meta = {
  apiEndpoint: (v: string) => `/check/${v}`,
  name: "name",
  // the hook expects `searchParams`, not `filters`.  the previous
  // implementation used the wrong key which made the early validation check
  // pass accidentally; our fix ensures runners are typed correctly.
  searchParams: { filterBy: "name" },
  task: "whatever",
};

describe("useDebouncedChecker", () => {
  // we need a place to store the form object that is created inside the
  // renderHook call.  hooks must only be used within React function
  // components, so we cannot call useForm() in beforeEach.
  const formRef: { current: ReturnType<typeof useForm> | null } = {
    current: null,
  };

  beforeEach(() => {
    vi.useFakeTimers();

    // reset fakeFetch state for every test
    fakeFetch.error = {};
    fakeFetch.fetchParams = { url: "", searchParams: {} };
    fakeFetch.setFetchParams.mockImplementation((upd) => {
      if (typeof upd === "function") {
        fakeFetch.fetchParams = upd(fakeFetch.fetchParams);
      } else {
        fakeFetch.fetchParams = upd;
      }
    });
    fakeFetch.onSubmit.mockClear();
    fakeFetch.setFetchParams.mockClear();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  test("clears existing field error when a new check starts", async () => {
    const hook = await renderHook(
      () => {
        const f = useForm();
        formRef.current = f;
        return useDebouncedChecker(f, 0);
      },
      { wrapper: AppTestWrapper },
    );
    const form = formRef.current!;

    // manually inject an error on the field so we can verify it gets cleared
    form.setError("name", { type: "manual", message: "old" });
    expect(form.getFieldState("name").error).toBeDefined();

    const { availabilityCheck } = getHookResults(hook);

    await act(async () => {
      availabilityCheck(makeEvent("foo"), meta);
      // advance the timer so debounce callback fires
      vi.runAllTimers();
    });

    // after the call we expect the form error to have been removed by our
    // logic (not by RHF internal validation)
    expect(form.getFieldState("name").error).toBeUndefined();

    // and the fetchParams should have been updated with the trimmed value
    expect(fakeFetch.setFetchParams).toHaveBeenCalled();
    expect(fakeFetch.fetchParams.url).toEqual("/check/foo");
  });

  test("re-applies availability error when trimmed value stays the same", async () => {
    const hook = await renderHook(
      () => {
        const f = useForm();
        formRef.current = f;
        return useDebouncedChecker(f, 0);
      },
      { wrapper: AppTestWrapper },
    );
    const form = formRef.current!;
    const { availabilityCheck } = getHookResults(hook);

    // initial check with "bac" -> sets fetchParams
    await act(async () => {
      availabilityCheck(makeEvent("bac"), meta);
      vi.runAllTimers();
    });
    expect(fakeFetch.fetchParams.url).toEqual("/check/bac");

    // simulate server response saying name is unavailable
    fakeFetch.error = { data: { available: false } };
    fakeFetch.fetchParams.searchParams = { filterBy: "name" };

    // re-render to fire effect that sets the manual error
    hook.rerender();
    expect(form.getFieldState("name").error).toBeDefined();
    const message = form.getFieldState("name").error?.message;

    // now type a second space (raw value changes but trimmed remains "bac")
    await act(async () => {
      availabilityCheck(makeEvent("bac "), meta);
      vi.runAllTimers();
    });

    // the error should still be present and have the same message
    expect(form.getFieldState("name").error?.message).toEqual(message);

    // we must not have issued a new fetchParams update since trimmed value
    // didn't change
    expect(fakeFetch.setFetchParams).toHaveBeenCalledTimes(1);
  });

  test("short-circuits network when cache already has unavailable result", async () => {
    const hook = await renderHook(
      () => {
        const f = useForm();
        formRef.current = f;
        return useDebouncedChecker(f, 0);
      },
      { wrapper: AppTestWrapper },
    );
    const form = formRef.current!;
    const { availabilityCheck } = getHookResults(hook);

    // Capture the onCacheVerify callback that the hook installs on fetchParams
    let capturedOnCacheVerify: ((data: any) => unknown) | undefined;
    fakeFetch.setFetchParams.mockImplementation((upd) => {
      if (typeof upd === "function") {
        fakeFetch.fetchParams = upd(fakeFetch.fetchParams);
      } else {
        fakeFetch.fetchParams = upd;
      }
      capturedOnCacheVerify = fakeFetch.fetchParams.onCacheVerify;
    });

    await act(async () => {
      availabilityCheck(makeEvent("bac"), meta);
      vi.runAllTimers();
    });

    expect(fakeFetch.setFetchParams).toHaveBeenCalled();
    expect(capturedOnCacheVerify).toBeTypeOf("function");

    // onCacheVerify must reject with an Error carrying `data` so useFetch
    // propagates availability information as an error state.
    await expect(
      capturedOnCacheVerify!({ available: false }),
    ).rejects.toMatchObject({
      data: { available: false },
    });

    // simulate the error propagated by useFetch after cache verification fails
    fakeFetch.error = { data: { available: false } };
    fakeFetch.fetchParams.searchParams = { filterBy: "name" };
    hook.rerender();

    expect(form.getFieldState("name").error?.message).toContain("déjà utilisé");
  });

  test("regression: effect responds when cache verifier rejects raw data", async () => {
    const hook = await renderHook(
      () => {
        const f = useForm();
        formRef.current = f;
        return useDebouncedChecker(f, 0);
      },
      { wrapper: AppTestWrapper },
    );
    const form = formRef.current!;
    const { availabilityCheck } = getHookResults(hook);

    let onCacheCb: ((cached: any) => any) | undefined;
    fakeFetch.setFetchParams.mockImplementation((upd) => {
      if (typeof upd === "function") {
        fakeFetch.fetchParams = upd(fakeFetch.fetchParams);
      } else {
        fakeFetch.fetchParams = upd;
      }
      onCacheCb = fakeFetch.fetchParams.onCacheVerify;
    });

    await act(async () => {
      availabilityCheck(makeEvent("foo"), meta);
      vi.runAllTimers();
    });

    // invoke verifier with raw payload (mimic pre‑fix behaviour)
    await act(async () => {
      if (onCacheCb) {
        try {
          await onCacheCb({ available: false });
        } catch (err) {
          // propagate the rejection as the fetch error so the hook's useEffect fires
          fakeFetch.error = err as any;
        }
      }
    });

    hook.rerender();
    expect(form.getFieldState("name").error?.message).toContain("déjà utilisé");
  });
});
