import { useAppStore } from "@/hooks/store/AppStore";
import type { User } from "@/hooks/store/types/store.types";
import { testQueryClient } from "@/tests/test-utils/AppTestWrapper";
import { getOpenPopoverCommandDebugText } from "@/tests/test-utils/vitest-browser.helpers";
import { beforeEach, expect, vi } from "vitest";

export async function expectPopoverToContain(text: RegExp, timeout = 1000) {
  await expect
    .poll(() => getOpenPopoverCommandDebugText(), { timeout })
    .toMatch(text);
}

export function setupUiTestState() {
  beforeEach(() => {
    // Prevent tests from causing a page reload via form submit/navigation which
    // breaks the vitest browser iframe orchestration when running suites together.
    if (!(document as any).__preventSubmitHandlerAdded) {
      document.addEventListener("submit", (e) => e.preventDefault(), true);
      (document as any).__preventSubmitHandlerAdded = true;
    }

    // Prevent programmatic navigation (assign/replace/open) during tests which can
    // break the browser-based test runner when multiple suites run together.
    if (!(window as any).__preventNavigationAdded) {
      try {
        // Replace with no-op implementations for the test environment.
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        window.location.assign = () => undefined;
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        window.location.replace = () => undefined;
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        window.open = () => null;
      } catch {
        // Ignore if not allowed to override in the environment.
      }
      (window as any).__preventNavigationAdded = true;
    }

    history.replaceState({ idx: 0 }, "", "/");
    testQueryClient.clear();
    vi.unstubAllGlobals();

    const user: User = {
      userId: "00000000-0000-0000-0000-000000000999",
      name: "Test User",
      email: "test.user@example.com",
      role: "TEACHER",
      token: "token",
      refreshToken: "refresh",
      avatar: "",
      schoolName: "Test School",
    };

    useAppStore.getState().login(user);
  });
}

export { AppTestWrapper } from "@/tests/test-utils/AppTestWrapper";
