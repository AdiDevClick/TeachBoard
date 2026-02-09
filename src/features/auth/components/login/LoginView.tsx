import { withStyledForm } from "@/components/HOCs/withStyledForm";
import { API_ENDPOINTS } from "@/configs/api.endpoints.config";
import { passwordRecoveryInputControllers } from "@/data/inputs-controllers.data.ts";
import { LOGIN_CARD } from "@/features/auth/components/login/config/login.configs";
import { LoginFormController } from "@/features/auth/components/login/controller/LoginFormController";
import { inputLoginControllers } from "@/features/auth/components/login/forms/login-inputs";

import {
  loginFormSchema,
  type LoginFormSchema,
  type LoginInputItem,
} from "@/features/auth/components/login/models/login.models";
import { PwForgottenController } from "@/features/auth/components/pw-forgotten/controller/PwForgottenController";
import {
  pwRecoveryFormSchema,
  type PwRecoveryFormSchema,
} from "@/models/pw-recovery.model";
import type { PageWithControllers } from "@/types/AppPagesInterface.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ComponentProps, MouseEvent } from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";

const resetPasswordButtonText = "Réinitialiser le mot de passe";
const backToLoginLinkText = "Retour à la connexion";
const forgotPasswordLinkText = "Mot de passe oublié ?";
const loginLinkTo = "/login";

/**
 * View component for the login form.
 *
 * @description This inits Zod validated form
 *
 * @param pageId - The ID of the page.
 * @param inputControllers - The input controllers for the form (this needs to be already validated by Zod Schema).
 * @param modalMode - Whether the component is in modal mode.
 * @param className - Additional class names for the component.
 * @param props - Additional props.
 */
function LoginView({
  pageId = "login",
  modalMode = false,
  className = "grid gap-4",
  inputControllers = inputLoginControllers,
  ...props
}: Readonly<PageWithControllers<LoginInputItem>>) {
  const [isPwForgotten, setIsPwForgotten] = useState(false);

  const loginForm = useForm<LoginFormSchema>({
    resolver: zodResolver(loginFormSchema),
    mode: "all",
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const recoveryForm = useForm<PwRecoveryFormSchema>({
    resolver: zodResolver(pwRecoveryFormSchema),
    mode: "all",
    defaultValues: {
      identifier: "",
    },
  });

  function handleTogglePwForgotten(e?: MouseEvent) {
    e?.preventDefault?.();
    setIsPwForgotten((prev) => !prev);
  }

  const sharedProps = {
    pageId,
    className,
    modalMode,
    setIsPwForgotten,
    isPwForgotten,
    card: LOGIN_CARD,
    onClick: handleTogglePwForgotten,
    ...props,
  };

  const loginProps = {
    ...sharedProps,
    formId: `${pageId}-form`,
    form: loginForm,
    inputControllers,
    textToDisplay: {
      defaultText: forgotPasswordLinkText,
      pwForgottenLinkTo: "/forgot-password",
      buttonText: "Se connecter",
    },
    submitDataReshapeFn: API_ENDPOINTS.POST.AUTH.LOGIN.dataReshape,
    submitRoute: API_ENDPOINTS.POST.AUTH.LOGIN.endpoint,
  } satisfies ComponentProps<typeof LoginForm>;

  const recoveryProps = {
    ...sharedProps,
    formId: `${pageId}-form-pw-recovery`,
    form: recoveryForm,
    inputControllers: passwordRecoveryInputControllers,
    textToDisplay: {
      defaultText: backToLoginLinkText,
      pwForgottenLinkTo: loginLinkTo,
      buttonText: resetPasswordButtonText,
    },
    submitDataReshapeFn: API_ENDPOINTS.POST.AUTH.PASSWORD_RECOVERY.dataReshape,
    submitRoute: API_ENDPOINTS.POST.AUTH.PASSWORD_RECOVERY.endpoint,
  } satisfies ComponentProps<typeof PwForgotten>;

  return (
    <>
      {isPwForgotten && <PwForgotten {...recoveryProps} />}
      {!isPwForgotten && <LoginForm {...loginProps} />}
    </>
  );
}

const LoginForm = withStyledForm(LoginFormController);
const PwForgotten = withStyledForm(PwForgottenController);

export default LoginView;
