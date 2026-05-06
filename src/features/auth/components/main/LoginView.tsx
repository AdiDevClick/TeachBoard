import { API_ENDPOINTS } from "@/configs/api.endpoints.config";
import { LOGIN_CARD } from "@/features/auth/components/login/config/login.configs";
import { LoginFormController } from "@/features/auth/components/login/controller/LoginFormController";
import { inputLoginControllers } from "@/features/auth/components/login/forms/login-inputs";

import {
  loginFormSchema,
  type LoginFormSchema,
} from "@/features/auth/components/login/models/login.models";
import { LoginPageView } from "@/features/auth/components/main/exports/login-view.exports";
import type { LoginViewProps } from "@/features/auth/components/main/types/login-view.types";
import { PwForgottenController } from "@/features/auth/components/pw-forgotten/controller/PwForgottenController";
import { passwordRecoveryInputControllers } from "@/features/auth/components/pw-forgotten/forms/pw-recovery.inputs";
import {
  pwRecoveryFormSchema,
  type PwRecoveryFormSchema,
} from "@/features/auth/components/pw-forgotten/models/pw-recovery.model";
import { zodResolver } from "@hookform/resolvers/zod";
import type { MouseEvent } from "react";
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
}: LoginViewProps) {
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

  const formIdToUse = isPwForgotten
    ? `${pageId}-form-pw-recovery`
    : `${pageId}-form`;
  const formToUse = isPwForgotten ? recoveryForm : loginForm;

  const defaultProps = {
    pageId,
    className,
  };

  const sharedProps = {
    ...defaultProps,
    modalMode,
    setIsPwForgotten,
    isPwForgotten,
    card: LOGIN_CARD,
    onClick: handleTogglePwForgotten,
    textToDisplay: {
      defaultText: isPwForgotten ? backToLoginLinkText : forgotPasswordLinkText,
      pwForgottenLinkTo: isPwForgotten ? loginLinkTo : "/forgot-password",
      buttonText: isPwForgotten ? resetPasswordButtonText : "Se connecter",
    },
    ...props,
  };

  const pageProps = {
    ...sharedProps,
    formId: formIdToUse,
    form: formToUse,
  };

  return (
    <LoginPageView {...pageProps}>
      {isPwForgotten ? (
        <PwForgottenController
          {...defaultProps}
          formId={formIdToUse}
          form={recoveryForm}
          inputControllers={passwordRecoveryInputControllers}
          submitDataReshapeFn={
            API_ENDPOINTS.POST.AUTH.PASSWORD_RECOVERY.dataReshape
          }
          submitRoute={API_ENDPOINTS.POST.AUTH.PASSWORD_RECOVERY.endpoint}
        />
      ) : (
        <LoginFormController
          {...defaultProps}
          formId={formIdToUse}
          form={loginForm}
          inputControllers={inputControllers}
          submitDataReshapeFn={API_ENDPOINTS.POST.AUTH.LOGIN.dataReshape}
          submitRoute={API_ENDPOINTS.POST.AUTH.LOGIN.endpoints.MAIN}
        />
      )}
    </LoginPageView>
  );
}

export default LoginView;
