import { ControlledInputList } from "@/components/Inputs/exports/labelled-input.exports";
import {
  debugLogs,
  loginFormControllerPropsInvalid,
} from "@/configs/app-components.config";
import type { LoginFormControllerProps } from "@/features/auth/components/login/controller/types/login-form-controller.types";
import type { PwForgottenControllerProps } from "@/features/auth/components/pw-forgotten/controller/types/pw-forgotten-controller.types";
import { passwordRecoveryInputControllers } from "@/features/auth/components/pw-forgotten/forms/pw-recovery.inputs";
import { useAppForm } from "@/features/auth/hooks/useAppForm";
import { useEffect, useEffectEvent, useRef } from "react";

/**
 * Password forgotten form component
 *
 * @param className - Additional class names for the component
 * @param inputControllers - Array of input controller objects
 * @param submitDataReshapeFn - Function to reshape the form data before submitting (optional)
 * @param submitRoute - API endpoint to submit the form data to (optional)
 * @param form - The form instance from react-hook-form
 * @param formId - The ID of the form
 */
export function PwForgottenController(props: PwForgottenControllerProps) {
  if (
    loginFormControllerPropsInvalid(
      props as unknown as LoginFormControllerProps,
    )
  ) {
    debugLogs("PwForgottenControllerProps", { type: "propsValidation", props });
  }

  const {
    submitDataReshapeFn,
    submitRoute,
    form,
    formId,
    className,
    pageId,
    inputControllers = passwordRecoveryInputControllers,
  } = props;

  const {
    setRef,
    response,
    resetFormAndTriggerNavigation,
    newItemCallback,
    onSubmit,
    closeDialog,
  } = useAppForm({
    form,
    pageId,
    submitRoute,
    submitDataReshapeFn,
  });

  // Prevent effect from re-running when `open` changes after login success
  const hasHandledPwForgotSuccess = useRef(false);

  /**
   * RESULTS - use the callback to navigate and reset form on success, and handle errors
   */
  const triggerNavigation = useEffectEvent(() => {
    resetFormAndTriggerNavigation();
    closeDialog(null, pageId);
  });

  /**
   * RESULTS - use the callback to open the new modal
   */
  const sendEmailSuccess = useEffectEvent(() => {
    newItemCallback({ task: "pw-recovery-email-sent" });
  });

  /**
   * Effect to handle loading, success, and error states
   *
   * @description It will open the new modal upon successful password recovery email sending and navigate to the home page.
   */
  useEffect(() => {
    if (response && !hasHandledPwForgotSuccess.current) {
      hasHandledPwForgotSuccess.current = true;

      sendEmailSuccess();
      triggerNavigation();
    }
  }, [response]);

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
