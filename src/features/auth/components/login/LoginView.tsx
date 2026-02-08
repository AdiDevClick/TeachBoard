import { AppFieldDescriptionWithLink } from "@/components/Fields/AppFieldDescriptionWithLink";
import type { WithStyledFormProps } from "@/components/HOCs/types/with-styled-form.types";
import { withStyledForm } from "@/components/HOCs/withStyledForm";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { passwordRecoveryInputControllers } from "@/data/inputs-controllers.data.ts";
import { LOGIN_CARD } from "@/features/auth/components/login/config/login.configs";
import { LoginFormController } from "@/features/auth/components/login/controller/LoginFormController";
import { inputLoginControllers } from "@/features/auth/components/login/forms/login-inputs";

import {
  formSchema,
  type LoginFormSchema,
  type LoginInputItem,
  type RecoveryFormSchema,
} from "@/features/auth/components/login/models/login.models";
import { PwForgottenController } from "@/features/auth/components/pw-forgotten/controller/PwForgottenController";
import { pwRecoverySchema } from "@/models/pw-recovery.model.ts";
import type { PageWithControllers } from "@/types/AppPagesInterface.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import type { MouseEvent } from "react";
import { useState } from "react";
import { useForm, useFormState } from "react-hook-form";

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
  let formId = pageId + "-form";

  if (isPwForgotten) {
    defaultText = backToLoginLinkText;
    pwForgottenLinkTo = loginLinkTo;
    buttonText = resetPasswordButtonText;
    inputControllersToUse = passwordRecoveryInputControllers;
    formId = formId + "-pw-recovery";
  }

  function handleTogglePwForgotten(e?: MouseEvent) {
    e?.preventDefault?.();
    setIsPwForgotten((prev) => !prev);
    // onClick={() =>
    //   handleOnOpen({
    //     e,
    //     task: "signup",
    //   })
    // }
  }

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
    onClick: handleTogglePwForgotten,
    // provide defaults for required controller props so consumers that don't
    // pass them explicitly won't trigger a missing-props type error
    // (LoginFormController expects GETendPoint and POSTendPoint)
    // submitRoute: "",
    // submitDataReshapeFn: (data: unknown) => data,
    ...props,
  };

  return (
    <>
      {isPwForgotten && <PwForgottenController {...commonProps} />}
      {!isPwForgotten && <LoginForm {...commonProps} />}
    </>
  );
}

const LoginForm = withStyledForm(LoginFormController);

export default LoginView;

export type FooterFieldsProps = Pick<
  WithStyledFormProps,
  "form" | "formId" | "textToDisplay"
> & {
  onClick?: (_e?: MouseEvent) => void;
};

/**
 * Footer fields component for the login form, including the submit button and a link to toggle between login and password recovery modes.
 *
 * @param form - The form object returned by the useForm hook, containing methods and state for managing the form.
 * @param formId - The ID of the form, used to associate the submit button with the form.
 * @param textToDisplay - An object containing text for the button and link, allowing for dynamic display based on the current mode (login or password recovery).
 * @param onClick - Optional click handler for the link, allowing for custom behavior when toggling between modes.
 */
export function FooterFields({
  form,
  formId,
  textToDisplay,
  onClick,
}: FooterFieldsProps) {
  const { isValid } = useFormState({ control: form.control });
  return (
    <Field>
      <Button type="submit" disabled={!isValid} form={formId}>
        {textToDisplay.buttonText}
      </Button>
      <AppFieldDescriptionWithLink
        linkText="Inscrivez-vous ici"
        linkTo="/signup"
        onClick={onClick}
      >
        Vous n'avez pas de compte ?{" "}
      </AppFieldDescriptionWithLink>
    </Field>
  );
}
