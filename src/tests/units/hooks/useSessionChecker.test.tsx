import { useAppStore } from "@/api/store/AppStore";
import getHookResults from "@/tests/test-utils/getHookResults.ts";
import { UniqueSet } from "@/utils/UniqueSet";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { renderHook } from "vitest-browser-react";

const mockNavigate = vi.fn();
const mockOpenDialog = vi.fn();
const mockSetFetchParams = vi.fn();
let currentPath = "/evaluations";

vi.mock("@/hooks/database/classes/useCommandHandler", async () => {
  const actual = await vi.importActual<
    typeof import("@/hooks/database/classes/useCommandHandler")
  >("@/hooks/database/classes/useCommandHandler");

  return {
    ...actual,
    useCommandHandler: () => ({
      setFetchParams: mockSetFetchParams,
      openDialog: mockOpenDialog,
      data: undefined,
      isLoading: false,
      isLoaded: false,
      error: undefined,
    }),
  };
});

vi.mock("react-router-dom", async () => {
  const actual =
    await vi.importActual<typeof import("react-router-dom")>(
      "react-router-dom",
    );

  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => ({ pathname: currentPath }),
  };
});

const { useSessionChecker } =
  await import("@/hooks/database/sessions/useSessionChecker.ts");

describe("useSessionChecker", () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    mockOpenDialog.mockClear();
    mockSetFetchParams.mockClear();
    useAppStore.setState({
      user: null,
      sessionSynced: false,
      lastUserActivity: new UniqueSet(),
      isLoggedIn: false,
    });
    currentPath = "/evaluations";
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  test("does not perform session check on public pages", async () => {
    currentPath = "/";

    await renderHook(() => useSessionChecker());

    expect(mockSetFetchParams).not.toHaveBeenCalled();
  });

  test("opens a soft login modal and keeps content visible when session check fails", async () => {
    currentPath = "/about";

    const hook = await renderHook(() => useSessionChecker());
    const result = getHookResults(hook);

    await result.act(async () => {
      await Promise.resolve();
    });

    const params = mockSetFetchParams.mock.calls.at(-1)?.[0];

    await result.act(async () => {
      params.onError({ status: 401 });
    });

    expect(mockNavigate).not.toHaveBeenCalled();
    expect(mockOpenDialog).toHaveBeenCalledWith(
      null,
      "login",
      expect.any(Object),
    );
    expect(result.safeToDisplay).toBe(true);
  });

  test("hides content immediately when navigating from safe to secure route", async () => {
    currentPath = "/evaluations/TP";

    const hook = await renderHook(() => useSessionChecker());
    const result = getHookResults(hook);

    await result.act(async () => {
      await Promise.resolve();
    });

    expect(result.safeToDisplay).toBe(true);

    currentPath = "/evaluations/delete/123";
    hook.rerender();

    expect(result.safeToDisplay).toBe(false);
  });

  test("opens a safe login modal and redirects after close when session check fails", async () => {
    currentPath = "/evaluations/Atelier";

    const hook = await renderHook(() => useSessionChecker());
    const result = getHookResults(hook);

    await result.act(async () => {
      await Promise.resolve();
    });

    const params = mockSetFetchParams.mock.calls.at(-1)?.[0];

    await result.act(async () => {
      params.onError({ status: 401 });
    });

    expect(mockOpenDialog).toHaveBeenCalledWith(
      null,
      "login",
      expect.objectContaining({ onClose: expect.any(Function) }),
    );

    const onClose = mockOpenDialog.mock.calls[0][2].onClose;
    await result.act(async () => {
      onClose();
    });

    expect(mockNavigate).toHaveBeenCalledWith("/login", {
      replace: true,
    });
    expect(result.safeToDisplay).toBe(true);
  });

  test("opens a secure login modal without content and redirects after close when session check fails", async () => {
    currentPath = "/evaluations/delete/123";

    const hook = await renderHook(() => useSessionChecker());
    const result = getHookResults(hook);

    await result.act(async () => {
      await Promise.resolve();
    });

    const params = mockSetFetchParams.mock.calls.at(-1)?.[0];

    await result.act(async () => {
      params.onError({ status: 403 });
    });

    expect(mockOpenDialog).toHaveBeenCalledWith(
      null,
      "login",
      expect.objectContaining({ onClose: expect.any(Function) }),
    );
    expect(result.safeToDisplay).toBe(false);

    const onClose = mockOpenDialog.mock.calls[0][2].onClose;
    await result.act(async () => {
      onClose();
    });

    expect(mockNavigate).toHaveBeenCalledWith("/login", {
      replace: true,
    });
  });

  test("re-runs secure session check after login and unlocks content on success", async () => {
    currentPath = "/evaluations/delete/123";

    const hook = await renderHook(() => useSessionChecker());
    const result = getHookResults(hook);

    await result.act(async () => {
      await Promise.resolve();
    });

    const firstParams = mockSetFetchParams.mock.calls.at(-1)?.[0];

    await result.act(async () => {
      firstParams.onError({ status: 403 });
    });

    expect(result.safeToDisplay).toBe(false);

    const callCountBeforeLogin = mockSetFetchParams.mock.calls.length;

    await result.act(async () => {
      useAppStore.setState({ isLoggedIn: true });
      await Promise.resolve();
    });

    expect(mockSetFetchParams.mock.calls.length).toBeGreaterThan(
      callCountBeforeLogin,
    );

    const secondParams = mockSetFetchParams.mock.calls.at(-1)?.[0];

    if (!secondParams) {
      throw new Error("Expected a second session-check request after login");
    }

    await result.act(async () => {
      secondParams.onSuccess({});
    });

    expect(result.safeToDisplay).toBe(true);
  });

  test("hides secure content again after logout even if the route was previously unlocked", async () => {
    currentPath = "/evaluations/create/classe";
    useAppStore.setState({ isLoggedIn: true });

    const hook = await renderHook(() => useSessionChecker());
    const result = getHookResults(hook);

    await result.act(async () => {
      await Promise.resolve();
    });

    const firstParams = mockSetFetchParams.mock.calls.at(-1)?.[0];

    if (!firstParams) {
      throw new Error("Expected an initial session-check request");
    }

    await result.act(async () => {
      firstParams.onSuccess({});
    });

    expect(result.safeToDisplay).toBe(true);

    await result.act(async () => {
      useAppStore.setState({
        isLoggedIn: false,
        sessionSynced: false,
      });
      currentPath = "/";
      hook.rerender();
      await Promise.resolve();
    });

    await result.act(async () => {
      currentPath = "/evaluations/create/classe";
      hook.rerender();
      await Promise.resolve();
    });

    expect(result.safeToDisplay).toBe(false);
  });

  test("does not trigger a login modal while logging out before navigating to a public page", async () => {
    currentPath = "/evaluations/create/classe";
    useAppStore.setState({
      isLoggedIn: true,
      sessionSynced: true,
    });

    const hook = await renderHook(() => useSessionChecker());
    const result = getHookResults(hook);

    await result.act(async () => {
      await Promise.resolve();
    });

    mockSetFetchParams.mockClear();
    mockOpenDialog.mockClear();

    await result.act(async () => {
      useAppStore.setState({
        isLoggedIn: false,
        sessionSynced: false,
      });
      await Promise.resolve();
    });

    await result.act(async () => {
      currentPath = "/";
      hook.rerender();
      await Promise.resolve();
    });

    expect(mockSetFetchParams).not.toHaveBeenCalled();
    expect(mockOpenDialog).not.toHaveBeenCalled();
  });
});
