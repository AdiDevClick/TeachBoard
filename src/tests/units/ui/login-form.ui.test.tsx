import { API_ENDPOINTS } from "@/configs/api.endpoints.config.ts";
import { LoginFormController } from "@/features/login/components/main/controller/LoginFormController.tsx";
import {
  formSchema,
  type LoginFormSchema,
} from "@/features/login/components/main/models/login.models";
import { AppTestWrapper } from "@/tests/components/AppTestWrapper";
import { setupUiTestState } from "@/tests/test-utils/class-creation/class-creation.ui.shared";
import {
  checkFormValidityAndSubmit,
  fillFieldsEnsuringSubmitDisabled,
  getLastPostJsonBodyByUrl,
  rx,
  stubFetchRoutes,
  submitButtonShouldBeDisabled,
} from "@/tests/test-utils/vitest-browser.helpers";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { afterEach, describe, expect, test, vi } from "vitest";
import { page } from "vitest/browser";

let loginForm: any = null;

function LoginFormControllerWrapper({
  isPwForgotten = false,
}: {
  isPwForgotten?: boolean;
}) {
  const form = useForm<LoginFormSchema>({
    defaultValues: { identifier: "", password: "" },
    mode: "onChange",
    resolver: zodResolver(formSchema),
  });
  loginForm = form;

  const textToDisplay = {
    defaultText: "Mot de passe oublié ?",
    pwForgottenLinkTo: "/pw-recovery",
    buttonText: isPwForgotten ? "Envoyer" : "Se connecter",
  };

  return (
    <LoginFormController
      pageId="login"
      formId="login-form"
      form={form}
      isPwForgotten={isPwForgotten}
      textToDisplay={textToDisplay}
    />
  );
}

const loginResponse = {
  session: "SESSION_TOKEN",
  refreshToken: "REFRESH_TOKEN",
  user: {
    id: "00000000-0000-4000-8000-000000009999",
    username: "test.user",
    firstName: "Test",
    lastName: "User",
    email: "test.user@example.com",
    role: "TEACHER",
  },
};

import { useAppStore } from "@/api/store/AppStore";

setupUiTestState(
  <AppTestWrapper>
    <LoginFormControllerWrapper />
  </AppTestWrapper>,
  {
    beforeEach: () => {
      // Ensure no user is logged in for login tests
      useAppStore.getState().logout();
      stubFetchRoutes({
        postRoutes: [[API_ENDPOINTS.POST.AUTH.LOGIN.endpoint, loginResponse]],
      });
    },
  },
);

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("UI flow: login form", () => {
  test("renders form and validates inputs before POST", async () => {
    // Form labels
    await expect
      .element(page.getByLabelText(rx("Identifiant")))
      .toBeInTheDocument();
    await expect
      .element(page.getByLabelText(rx("Mot de passe")))
      .toBeInTheDocument();

    // Submit should be disabled initially (submit button identified by exact text)
    await submitButtonShouldBeDisabled("Se connecter");

    // Fill fields (assert submit remains disabled during input)
    await fillFieldsEnsuringSubmitDisabled("Se connecter", [
      { label: rx("Identifiant"), value: "test.user@example.com" },
      { label: rx("Mot de passe"), value: "supersecret" },
    ]);

    // Trigger validation (some environments need an explicit trigger) and submit
    await loginForm.trigger();
    await checkFormValidityAndSubmit("Se connecter");

    await expect
      .poll(
        () => getLastPostJsonBodyByUrl(API_ENDPOINTS.POST.AUTH.LOGIN.endpoint),
        {
          timeout: 2000,
        },
      )
      .toMatchObject({
        identifier: "test.user@example.com",
        password: "supersecret",
      });
  });
});
