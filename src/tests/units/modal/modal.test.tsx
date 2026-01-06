import type { DialogContextType } from "@/api/contexts/types/context.types";
import { useDialog } from "@/hooks/contexts/useDialog";
import { AppModals } from "@/pages/AllModals/AppModals";
import { AppTestWrapper } from "@/tests/components/AppTestWrapper";
import getHookResults from "@/tests/test-utils/getHookResults.ts";
import { handleModalOpening, wait } from "@/utils/utils";

import { type ReactNode } from "react";
import { beforeEach, expect, test } from "vitest";
import type { RenderHookResult } from "vitest-browser-react";

const wrapperWithRouter = ({ children }: { children: ReactNode }) => (
  <AppTestWrapper>
    <AppModals />
    {children}
  </AppTestWrapper>
);

let hook: RenderHookResult<DialogContextType, unknown> | undefined;
const newClick = () => new MouseEvent("click");
const getPathName = () => globalThis.location.pathname;

beforeEach(async () => {
  // Ensure history.state has idx to avoid errors in Modal when reading history.state.idx
  history.replaceState({ idx: 0 }, "", "/");
  hook = await renderHook(() => useDialog(), { wrapper: wrapperWithRouter });
});

test("openDialog updates isDialogOpen", async () => {
  const { act, isDialogOpen, openDialog, closeDialog } = getHookResults(hook!);

  expect(isDialogOpen("login")).toBe(false);

  // Wait short time to ensure the observedRef nodes are attached
  await wait(50);
  await act(async () => {
    openDialog(newClick(), "login");
  });

  expect(isDialogOpen("login")).toBe(true);

  await wait(150);
  await act(async () => {
    closeDialog(newClick(), "login");
  });

  expect(isDialogOpen("login")).toBe(false);
});

test("opening a navigation modal sets the URL and allows back/forward navigation", async () => {
  const { act, isDialogOpen, openDialog, closeDialog } = getHookResults(hook!);

  expect(isDialogOpen("login")).toBe(false);

  // Wait short time to ensure observedRefs are attached
  await wait(50);
  await act(async () => {
    openDialog(newClick(), "login");
  });

  // Modal's history push runs with a delay, wait a bit
  await wait(300);

  expect(getPathName()).toBe("/login");
  expect(isDialogOpen("login")).toBe(true);

  await act(async () => {
    closeDialog(newClick(), "login");
  });

  await wait(150);
  expect(isDialogOpen("login")).toBe(false);
  expect(getPathName()).toBe("/");
});

test("standard modal replaces another standard modal while alert can stack", async () => {
  const { act, isDialogOpen, openDialog, closeAllDialogs } = getHookResults(
    hook!
  );

  // Open login (standard)
  await wait(50);
  await act(async () => {
    openDialog(newClick(), "login");
  });

  await wait(50);
  expect(isDialogOpen("login")).toBe(true);

  // Open signup using handleModalOpening: this should close login and open signup
  await act(async () => {
    handleModalOpening({
      e: newClick(),
      dialogFns: {
        closeAllDialogs: closeAllDialogs,
        openDialog: openDialog,
      },
      modalName: "signup",
    });
  });
  await wait(50);

  expect(isDialogOpen("login")).toBe(false);
  expect(isDialogOpen("signup")).toBe(true);

  // Open an alert modal while signup is open: it should stack (both open)
  await act(async () => {
    openDialog(newClick(), "pw-recovery-email-sent");
  });

  await wait(50);
  expect(isDialogOpen("pw-recovery-email-sent")).toBe(true);
  expect(isDialogOpen("signup")).toBe(true);
});
