import type { API_ENDPOINTS } from "@/configs/api.endpoints.config";
import type LoginView from "@/features/auth/components/login/LoginView";
import type { LoginFormSchema } from "@/features/auth/components/login/models/login.models";
import type { ForgottenPw } from "@/features/auth/types/auth-types";
import type { AppControllerInterface } from "@/types/AppControllerInterface";
/**
 * @filedescription Types for the LoginFormController component, which handles the logic for the login form in the authentication flow.
 */

/**
 * Props for the LoginFormController component.
 */
export type LoginFormControllerProps = Readonly<
  AppControllerInterface<
    LoginFormSchema,
    typeof API_ENDPOINTS.POST.AUTH.LOGIN.endpoint,
    typeof API_ENDPOINTS.POST.AUTH.LOGIN.dataReshape
  > &
    Omit<Parameters<typeof LoginView>[0], "modalMode"> &
    ForgottenPw
>;
