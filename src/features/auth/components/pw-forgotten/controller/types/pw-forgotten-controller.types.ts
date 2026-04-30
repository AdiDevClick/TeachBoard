/**
 * @filedescription Types for the LoginFormController component, which handles the logic for the login form in the authentication flow.
 */

import type { API_ENDPOINTS } from "@/configs/api.endpoints.config";
import type {
  PwRecoveryFormSchema,
  PwRecoveryInputItem,
} from "@/features/auth/components/pw-forgotten/models/pw-recovery.model";
import type { AppControllerInterface } from "@/types/AppControllerInterface";

/**
 * @fileoverview Types for the PwForgottenController component, which handles the logic for the password recovery form in the authentication flow.
 */

/**
 * Props for the PwForgottenController component, which handles the logic for the password recovery form in the authentication flow.
 */
export type PwForgottenControllerProps = Readonly<
  AppControllerInterface<
    PwRecoveryFormSchema,
    typeof API_ENDPOINTS.POST.AUTH.PASSWORD_RECOVERY.endpoint,
    typeof API_ENDPOINTS.POST.AUTH.PASSWORD_RECOVERY.dataReshape
  > & {
    inputControllers?: readonly PwRecoveryInputItem[];
  }
>;
