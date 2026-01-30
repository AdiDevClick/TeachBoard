import { useAppStore } from "@/api/store/AppStore";
import type { User } from "@/api/store/types/app-store.types";
import { testQueryClient } from "@/tests/test-utils/testQueryClient";
import type { ReactNode } from "react";
import { beforeEach, vi } from "vitest";
import { render } from "vitest-browser-react";

type GlobalWithUiTestFlags = typeof globalThis & {
  __preventNavigationAdded?: boolean;
};

export function setupUiTestState(
  initialRender?: ReactNode,
  opts?: { beforeEach?: () => void | Promise<void> }
) {
  beforeEach(async () => {
    const g = globalThis as GlobalWithUiTestFlags;

    // Prevent programmatic navigation (assign/replace/open) during tests which can
    // break the browser-based test runner when multiple suites run together.
    if (!g.__preventNavigationAdded) {
      try {
        // Replace with no-op implementations for the test environment.
        const nav = globalThis as typeof globalThis & {
          location: Location & {
            assign: (url: string | URL) => void;
            replace: (url: string | URL) => void;
          };
          open: (
            url?: string | URL,
            target?: string,
            features?: string
          ) => Window | null;
        };

        nav.location.assign = () => undefined;
        nav.location.replace = () => undefined;
        nav.open = () => null;
      } catch {
        // Ignore if not allowed to override in the environment.
      }
      g.__preventNavigationAdded = true;
    }

    history.replaceState({ idx: 0 }, "", "/");
    testQueryClient.clear();
    vi.unstubAllGlobals();

    // Re-install test-specific stubs (e.g. fetch routes) after globals are reset.
    await opts?.beforeEach?.();

    const user: User = {
      userId: "00000000-0000-4000-8000-000000000999",
      name: "Test User",
      email: "test.user@example.com",
      role: "TEACHER",
      token: "token",
      refreshToken: "refresh",
      avatar: "",
      schoolName: "Test School",
    };

    useAppStore.getState().login(user);

    // Optionally render an initial tree (JSX) in the test environment.
    if (initialRender) {
      try {
        await render(initialRender as Parameters<typeof render>[0]);
      } catch {
        // ignore failures during setup rendering
      }
    }
  });
}
