import { EmailValidationController } from "@/pages/Email/controller/EmailValidationController.tsx";
import { AppTestWrapper } from "@/tests/components/AppTestWrapper";
import { setupUiTestState } from "@/tests/test-utils/class-creation/class-creation.ui.shared";
import { rx } from "@/tests/test-utils/vitest-browser.helpers";
import { afterEach, describe, expect, test, vi } from "vitest";
import { render } from "vitest-browser-react";
import { page } from "vitest/browser";

setupUiTestState();

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("UI flow: email validation controller", () => {
  test("calls onSubmit on mount to start validation", async () => {
    const onSubmit = vi.fn();
    await render(
      <AppTestWrapper>
        <EmailValidationController
          data={null}
          error={undefined}
          onSubmit={onSubmit}
        />
      </AppTestWrapper>
    );

    await expect
      .poll(() => onSubmit.mock.calls.length, { timeout: 1000 })
      .toEqual(1);
  });

  test("displays back-to-home button when error present", async () => {
    const onSubmit = vi.fn();
    const error = { message: "something went wrong" } as const;

    await render(
      <AppTestWrapper>
        <EmailValidationController
          data={null}
          error={error as any}
          onSubmit={onSubmit}
        />
      </AppTestWrapper>
    );

    await expect
      .element(page.getByRole("button", { name: rx("Revenir à l'accueil") }))
      .toBeInTheDocument();
  });
});
