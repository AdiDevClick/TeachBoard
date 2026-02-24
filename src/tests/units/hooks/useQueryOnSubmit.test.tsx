import { onFetch } from "@/hooks/database/functions/use-query-on-submit.functions";
import { useQueryOnSubmit } from "@/hooks/database/useQueryOnSubmit";
import { AppTestWrapper } from "@/tests/components/AppTestWrapper";
import { act } from "react";
import { afterEach, describe, expect, test, vi } from "vitest";
import { renderHook } from "vitest-browser-react";

// The `onFetch` helper is exported solely for testing; the hook normally
// exercises it internally.  We want to make sure that an already-aborted
// controller whose reason is the special `"Request completed"` string does not
// poison the next request.

describe("useQueryOnSubmit / onFetch helper", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  test("onFetch replaces an already-aborted controller before starting a new request", async () => {
    const controller = new AbortController();

    const fakeResponse = { success: "ok", ok: true };
    const fetchStub = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => fakeResponse,
    });
    vi.stubGlobal("fetch", fetchStub);

    // first invocation will use the provided controller and then abort it
    await onFetch({
      url: "/foo",
      method: "GET",
      abortController: controller,
    });

    // at this point onFetch has aborted the controller and recorded it in
    // the internal WeakMap.  the next call should detect that and create a
    // fresh controller internally.
    const result2 = await onFetch({
      url: "/foo",
      method: "GET",
      abortController: controller,
    });

    expect(fetchStub).toHaveBeenCalledTimes(2);
    const firstSignal = fetchStub.mock.calls[0][1].signal;
    const secondSignal = fetchStub.mock.calls[1][1].signal;
    expect(secondSignal).not.toBe(firstSignal);
    expect(result2).toEqual(fakeResponse);
  });

  test("useQueryOnSubmit resets the abort controller between submissions", async () => {
    const fetchStub = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ success: "x", ok: true }),
    });
    vi.stubGlobal("fetch", fetchStub);

    const { result } = await renderHook(
      () => useQueryOnSubmit(["t", { url: "/foo" }]),
      { wrapper: AppTestWrapper },
    );

    await act(async () => {
      await result.current.onSubmit();
    });

    expect(fetchStub).toHaveBeenCalledTimes(1);
    const firstSignal = fetchStub.mock.calls[0][1].signal;
    expect(firstSignal.aborted).toBe(true);

    // second submission should use a fresh, non‑aborted controller
    await act(async () => {
      await result.current.onSubmit();
    });
    expect(fetchStub).toHaveBeenCalledTimes(2);
    const secondSignal = fetchStub.mock.calls[1][1].signal;
    // we abort every controller after the fetch completes, so the second
    // object will also be marked aborted by the time we inspect it.  the key
    // property we care about is that it's a *different* signal than the first
    // invocation, which proves the ref was replaced successfully.
    expect(secondSignal).not.toBe(firstSignal);
  });

  // --- additional onFetch-specific unit tests --------------------------------

  test("onFetch returns result and only calls fetch once on 200 response", async () => {
    const controller = new AbortController();
    const success = { success: "ok", ok: true };
    const fetchStub = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => success,
    });
    vi.stubGlobal("fetch", fetchStub);

    const res = await onFetch({
      url: "/foo",
      method: "GET",
      abortController: controller,
    });
    expect(fetchStub).toHaveBeenCalledTimes(1);
    expect(res).toEqual(success);
  });

  test("onFetch retries once on 500 and eventually succeeds", async () => {
    const controller = new AbortController();
    const fetchStub = vi
      .fn()
      .mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: "err",
        json: async () => ({}),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: "y", ok: true }),
      });
    vi.stubGlobal("fetch", fetchStub);

    const res = await onFetch({
      url: "/foo",
      method: "POST",
      abortController: controller,
    });
    expect(fetchStub).toHaveBeenCalledTimes(2);
    expect(res).toEqual({ success: "y", ok: true });
  });

  test("onFetch throws if controller already aborted", async () => {
    const controller = new AbortController();
    controller.abort("user");
    await expect(
      onFetch({ url: "/foo", method: "GET", abortController: controller }),
    ).rejects.toMatchObject({ status: 499 });
  });

  test("onFetch times out after 6s and only triggers fetch once", async () => {
    vi.useFakeTimers();
    const controller = new AbortController();
    const fetchStub = vi.fn().mockImplementation(
      () =>
        new Promise(() => {
          /* never resolves */
        }),
    );
    vi.stubGlobal("fetch", fetchStub);

    const promise = onFetch({
      url: "/foo",
      method: "GET",
      abortController: controller,
    });
    // advance past timeout period
    vi.advanceTimersByTime(6000);
    await expect(promise).rejects.toMatchObject({ status: 408 });
    expect(fetchStub).toHaveBeenCalledTimes(1);
    vi.useRealTimers();
  });
});
