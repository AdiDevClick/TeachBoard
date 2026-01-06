import type { AppModalNames } from "@/configs/app.config.ts";
import { useCommandHandler } from "@/hooks/database/classes/useCommandHandler";
import { AppTestWrapper } from "@/tests/components/AppTestWrapper";
import { skillModal } from "@/tests/samples/command-handler-sample-datas";
import getHookResults from "@/tests/test-utils/getHookResults";
import type { TestFormValues } from "@/tests/types/tests.types.ts";
import type { ReactNode } from "react";
import { useForm } from "react-hook-form";
import { renderHook } from "vitest-browser-react";

const wrapperWithApp = ({ children }: { children: ReactNode }) => (
  <AppTestWrapper>{children}</AppTestWrapper>
);
/**
 * Reusable helper to render the `useCommandHandler` hook in tests.
 * Default `pageId` is `skillModal` from the test samples but can be overridden.
 */
export async function renderCommandHook(pageId: AppModalNames = skillModal) {
  const hook = await renderHook(
    () => {
      const form = useForm<TestFormValues>({
        defaultValues: { selected: [], selectedDetailed: [] },
      });
      return { ...useCommandHandler({ form, pageId }), form };
    },
    {
      wrapper: wrapperWithApp,
    }
  );
  return getHookResults(hook);
}
