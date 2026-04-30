import { ControlledInputList } from "@/components/Inputs/exports/labelled-input.exports";
import {
  debugLogs,
  loginFormControllerPropsInvalid,
} from "@/configs/app-components.config";
import type { LoginFormControllerProps } from "@/features/auth/components/login/controller/types/login-form-controller.types";
import { inputLoginControllers } from "@/features/auth/components/login/forms/login-inputs";
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
    debugLogs("LoginFormController", { type: "propsValidation", props });
  }

  const {
    submitDataReshapeFn,
    submitRoute,
    form,
    formId,
    className,
    pageId,
    inputControllers = inputLoginControllers,
  } = props;

  const { setRef, data, resetFormAndTriggerNavigation, onSubmit } = useAppForm({
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
    }
  }, [data]);

  return (
    <form
      ref={(el) => setRef(el, { name: pageId, id: formId })}
      id={formId}
      onSubmit={form.handleSubmit(onSubmit)}
      className={className}
    >
      <ControlledInputList items={inputControllers} control={form.control} />
    </form>
  );
}
