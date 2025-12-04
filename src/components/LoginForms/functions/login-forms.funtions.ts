import type { HandleRecoverPasswordClickParams } from "@/components/LoginForms/types/login-forms.types.ts";
import { preventDefaultAndStopPropagation } from "@/utils/utils.ts";

/**
 * Handles the click event for the "Recover Password" link.
 *
 * @param  e - Mouse event from clicking the link
 * @param isPwForgotten - Current state of password forgotten mode
 * @param setIsPwForgotten - State setter for password forgotten mode
 * @param form - The form instance to reset
 */
export function handleRecoverPasswordClick({
  e,
  isPwForgotten,
  setIsPwForgotten,
  form,
}: HandleRecoverPasswordClickParams) {
  preventDefaultAndStopPropagation(e);
  if (isPwForgotten) {
    // already in recovery mode; allow navigation
    setIsPwForgotten(false);
  } else {
    setIsPwForgotten(true);
    form.reset();
  }
}
