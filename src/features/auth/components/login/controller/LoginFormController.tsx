import { LoginButtonList } from "@/components/Buttons/exports/buttons.exports";
import { AppFieldDescriptionWithLink } from "@/components/Fields/AppFieldDescriptionWithLink.tsx";
import { ControlledInputList } from "@/components/Inputs/exports/labelled-input";
import { Field, FieldGroup, FieldSeparator } from "@/components/ui/field.tsx";
import { API_ENDPOINTS } from "@/configs/api.endpoints.config.ts";
import {
  debugLogs,
  loginFormControllerPropsInvalid,
} from "@/configs/app-components.config";
import { DEV_MODE, NO_QUERY_LOGS } from "@/configs/app.config.ts";
import { loginButtonsSvgs } from "@/configs/social.config.ts";
import type { LoginFormControllerProps } from "@/features/auth/components/login/controller/types/login-form-controller.types";
import { inputLoginControllers } from "@/features/auth/components/login/forms/login-inputs";
import { handleRecoverPasswordClick } from "@/features/auth/components/login/functions/login-forms.funtions";
import { useAppForm } from "@/features/auth/hooks/useAppForm";
import { useEffect, useEffectEvent, useRef } from "react";
import { toast } from "sonner";

/**
 * Login Form Controller
 *
 * @description This displays the login form and handles the logic for submitting the form, displaying login buttons, and handling the "forgot password" link.
 *
 * @param className - Additional class names for the component
 * @param inputControllers - Array of input controller objects
 * @param textToDisplay - Object containing text to display for the "forgot password" link
 * @param setIsPwForgotten - Function to toggle the password forgotten state
 * @param submitDataReshapeFn - Function to reshape the form data before submitting (optional)
 * @param submitRoute - API endpoint to submit the form data to (optional)
 * @param isPwForgotten - Boolean indicating whether the password forgotten form is currently displayed
 * @param form - The form instance from react-hook-form
 * @param formId - The ID of the form
 */
export function LoginFormController(props: LoginFormControllerProps) {
  if (loginFormControllerPropsInvalid(props)) {
    debugLogs("LoginFormController", props);
  }

  const {
    setIsPwForgotten,
    submitDataReshapeFn = API_ENDPOINTS.POST.AUTH.LOGIN.dataReshape,
    submitRoute = API_ENDPOINTS.POST.AUTH.LOGIN.endpoint,
    isPwForgotten,
    form,
    formId,
    className,
    pageId,
    textToDisplay,
    inputControllers = inputLoginControllers,
  } = props;

  const {
    setRef,
    data,
    resetFormAndTriggerNavigation,
    newItemCallback,
    onSubmit,
  } = useAppForm({
    form,
    pageId,
    submitRoute,
    submitDataReshapeFn,
  });

  // Prevent effect from re-running when `open` changes after login success
  const hasHandledLoginSuccess = useRef(false);

  /**
   * RESULTS - use the callback to navigate and reset form on success, and handle errors
   */
  const triggerNavigation = useEffectEvent(() => {
    resetFormAndTriggerNavigation();
  });

  /**
   * RESULTS - Effect login success
   *
   * @description This will only trigger once per data
   * @remarks Shows a toast on success
   */
  useEffect(() => {
    if (data && !hasHandledLoginSuccess.current) {
      hasHandledLoginSuccess.current = true;

      toast.success("Connexion réussie !", {
        id: "login-success-toast",
      });

      triggerNavigation();

      if (DEV_MODE && !NO_QUERY_LOGS) {
        console.debug("Query success in LoginView", data);
      }
    }
  }, [data]);

  return (
    <form
      ref={(el) => setRef(el, { name: pageId, id: formId })}
      id={formId}
      onSubmit={form.handleSubmit(onSubmit)}
      className={className}
    >
      <FieldGroup>
        <Field>
          <LoginButtonList
            items={loginButtonsSvgs}
            onClick={(e) => {
              newItemCallback({ e, task: "apple-login" });
            }}
          />
        </Field>
        <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
          Ou continuez avec
        </FieldSeparator>
        <ControlledInputList items={inputControllers} form={form} />
        <AppFieldDescriptionWithLink
          className="text-left"
          onClick={(e) =>
            handleRecoverPasswordClick({
              e,
              isPwForgotten,
              setIsPwForgotten,
              form,
            })
          }
          linkText={textToDisplay.defaultText}
          linkTo={textToDisplay.pwForgottenLinkTo}
        />
      </FieldGroup>
    </form>
  );
}
