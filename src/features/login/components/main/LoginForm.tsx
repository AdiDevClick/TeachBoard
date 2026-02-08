import withTitledCard from "@/components/HOCs/withTitledCard.tsx";
import { passwordRecoveryInputControllers } from "@/data/inputs-controllers.data.ts";
import { LOGIN_CARD } from "@/features/login/components/main/config/login.configs";
import { LoginFormController } from "@/features/login/components/main/controller/LoginFormController.tsx";
import { inputLoginControllers } from "@/features/login/components/main/forms/login-inputs.ts";

import {
  formSchema,
  type LoginFormSchema,
  type LoginInputItem,
  type RecoveryFormSchema,
} from "@/features/login/components/main/models/login.models";
import { pwRecoverySchema } from "@/models/pw-recovery.model.ts";
import type { PageWithControllers } from "@/types/AppPagesInterface.ts";
import { zodResolver } from "@hookform/resolvers/zod";
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
function LoginForm({
  pageId = "login",
  modalMode = false,
  className = "grid gap-4",
  inputControllers = inputLoginControllers,
  ...props
}: Readonly<PageWithControllers<LoginInputItem>>) {
  const [isPwForgotten, setIsPwForgotten] = useState(false);

  const schemaToUse = isPwForgotten ? pwRecoverySchema : formSchema;
  const form = useForm<LoginFormSchema | RecoveryFormSchema>({
    resolver: zodResolver(schemaToUse),
    mode: "all",
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  let defaultText = forgotPasswordLinkText;
  let pwForgottenLinkTo = "/forgot-password";
  let buttonText = "Se connecter";
  let inputControllersToUse = inputControllers;

  if (isPwForgotten) {
    defaultText = backToLoginLinkText;
    pwForgottenLinkTo = loginLinkTo;
    buttonText = resetPasswordButtonText;
    inputControllersToUse = passwordRecoveryInputControllers;
  }

  const formId = pageId + "-form";

  const commonProps = {
    pageId,
    formId,
    className,
    modalMode,
    form,
    setIsPwForgotten,
    isPwForgotten,
    inputControllers: inputControllersToUse,
    card: LOGIN_CARD,
    textToDisplay: {
      defaultText,
      pwForgottenLinkTo,
      buttonText,
    },
    ...props,
  };

  return (
    <LoginFormWithCard {...commonProps}>
      <LoginFormWithCard.Title />
      <LoginFormWithCard.Content />
    </LoginFormWithCard>
  );
}

const LoginFormWithCard = withTitledCard(LoginFormController);

export default LoginForm;
