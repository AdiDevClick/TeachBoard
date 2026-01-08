import withTitledCard from "@/components/HOCs/withTitledCard.tsx";
import { LoginFormController } from "@/components/LoginForms/controller/LoginFormController.tsx";
import {
  inputLoginControllers,
  passwordRecoveryInputControllers,
} from "@/data/inputs-controllers.data.ts";

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
const forgotPasswordLinkText = "Mot de passe oublié ?";
const loginLinkTo = "/login";

let defaultText = forgotPasswordLinkText;
let pwForgottenLinkTo = "/forgot-password";
let buttonText = "Se connecter";

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
 * @returns
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

  let inputControllersToUse = inputControllers;
  defaultText = forgotPasswordLinkText;

  if (isPwForgotten) {
    defaultText = backToLoginLinkText;
    pwForgottenLinkTo = loginLinkTo;
    buttonText = resetPasswordButtonText;
    inputControllersToUse = passwordRecoveryInputControllers;
  }

  const formId = pageId + "-form";

  const commonProps = useMemo(() => {
    return {
      pageId,
      formId,
      className,
      setIsPwForgotten,
      isPwForgotten,
      modalMode,
      titleProps,
      inputControllers: inputControllersToUse,
      textToDisplay: {
        defaultText,
        pwForgottenLinkTo,
        buttonText,
      },
      ...props,
      form,
    };
  }, [form.formState, isPwForgotten, props]);

  return <LoginFormWithCard displayFooter={false} {...commonProps} />;
}

const LoginFormWithCard = withTitledCard(LoginFormController);

export default LoginForm;
