import { LoginButtonList } from "@/components/Buttons/exports/buttons.exports";
import { ControlledInputList } from "@/components/Inputs/exports/labelled-input";
import { Field, FieldGroup, FieldSeparator } from "@/components/ui/field.tsx";
import {
  debugLogs,
  loginFormControllerPropsInvalid,
} from "@/configs/app-components.config";
import { DEV_MODE, NO_QUERY_LOGS } from "@/configs/app.config.ts";
import { loginButtonsSvgs } from "@/configs/social.config.ts";
import { passwordRecoveryInputControllers } from "@/data/inputs-controllers.data";
import type { PwForgottenControllerProps } from "@/features/auth/components/pw-forgotten/controller/types/pw-forgotten-controller.types";
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
  if (loginFormControllerPropsInvalid(props as any)) {
    debugLogs("PwForgottenControllerProps", props);
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

      if (DEV_MODE && !NO_QUERY_LOGS) {
        console.debug("Query success in PwForgottenController", response);
      }
    }
  }, [response]);

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
      </FieldGroup>
    </form>
  );
}
