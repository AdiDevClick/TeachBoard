import withTitledCard from "@/components/HOCs/withTitledCard.tsx";
import { LoginFormController } from "@/components/LoginForms/controller/LoginFormController.tsx";
import {
  inputLoginControllers,
  passwordRecoveryInputControllers,
} from "@/data/inputs-controllers.data.ts";

import { useLogin } from "@/hooks/database/login/useLogin.ts";
import {
  formSchema,
  type LoginFormSchema,
  type LoginInputItem,
  type RecoveryFormSchema,
} from "@/models/login.models.ts";
import { pwRecoverySchema } from "@/models/pw-recovery.model.ts";
import type { PageWithControllers } from "@/types/AppPagesInterface.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";

const titleProps = {
  title: "Welcome Back !",
  description: "Connectez-vous à votre compte TeachBoard.",
  className: "text-center",
};

const resetPasswordButtonText = "Réinitialiser le mot de passe";
const backToLoginLinkText = "Retour à la connexion";
const loginLinkTo = "/login";

let pwForgottenLinkText = "Mot de passe oublié ?";
let pwForgottenLinkTo = "/forgot-password";
let buttonText = "Se connecter";

/**
 * View component for the login form.
 *
 * @description This inits Zod validated form
 *
 * @param pageId - The ID of the page.
 * @param formId - The ID of the form.
 * @param inputControllers - The input controllers for the form (this needs to be already validated by Zod Schema).
 * @param modalMode - Whether the component is in modal mode.
 * @param props - Additional props.
 * @returns
 */
function LoginForm({
  pageId = "login-form-page-card",
  modalMode = false,
  inputControllers = inputLoginControllers,
  ...props
}: Readonly<PageWithControllers<LoginInputItem>>) {
  const [isPwForgotten, setIsPwForgotten] = useState(false);
  const loginHooks = useLogin({ isPwForgotten });

  const schemaToUse = isPwForgotten ? pwRecoverySchema : formSchema;

  const form = useForm<LoginFormSchema | RecoveryFormSchema>({
    resolver: zodResolver(schemaToUse),
    mode: "all",
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  let inputControllersToUse = inputControllers;

  if (isPwForgotten) {
    pwForgottenLinkText = backToLoginLinkText;
    pwForgottenLinkTo = loginLinkTo;
    buttonText = resetPasswordButtonText;
    inputControllersToUse = passwordRecoveryInputControllers;
  }

  const formId = pageId + "-form";

  const commonProps = useMemo(
    () => ({
      pageId,
      formId,
      form,
      setIsPwForgotten,
      isPwForgotten,
      modalMode,
      titleProps,
      displayFooter: false as const,
      inputControllers: inputControllersToUse,
      textToDisplay: {
        pwForgottenLinkText,
        pwForgottenLinkTo,
        buttonText,
      },
      loginHooks,
      ...props,
    }),
    [form.formState, isPwForgotten]
  );

  return <LoginFormWithCard {...commonProps} />;
}

const LoginFormWithCard = withTitledCard(LoginFormController);

export default LoginForm;
