/**
 * @filedescription Types for the LoginFormController component, which handles the logic for the login form in the authentication flow.
 */

import type { API_ENDPOINTS } from "@/configs/api.endpoints.config";
import type LoginView from "@/features/auth/components/login/LoginView";
import type { RecoveryFormSchema } from "@/features/auth/components/login/models/login.models";
import type { ForgottenPw } from "@/features/auth/types/auth-types";
import type { AppControllerInterface } from "@/types/AppControllerInterface";
import type { FieldValues } from "react-hook-form";

/**
 * @fileoverview Types for the PwForgottenController component, which handles the logic for the password recovery form in the authentication flow.
 */

/**
 * Props for the PwForgottenController component, which handles the logic for the password recovery form in the authentication flow.
 */
export type PwForgottenControllerProps<
  TForm extends FieldValues = RecoveryFormSchema,
> = Readonly<
  AppControllerInterface<
    TForm,
    typeof API_ENDPOINTS.POST.AUTH.PASSWORD_RECOVERY.endpoint,
    typeof API_ENDPOINTS.POST.AUTH.PASSWORD_RECOVERY.dataReshape
  > &
    Omit<Parameters<typeof LoginView>[0], "modalMode"> &
    ForgottenPw
>;
