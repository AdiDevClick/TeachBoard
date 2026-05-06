import type { API_ENDPOINTS } from "@/configs/api.endpoints.config";
import type {
  LoginFormSchema,
  LoginInputItem,
} from "@/features/auth/components/login/models/login.models";
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
    typeof API_ENDPOINTS.POST.AUTH.LOGIN.endpoints.MAIN,
    typeof API_ENDPOINTS.POST.AUTH.LOGIN.dataReshape
  > & {
    inputControllers?: readonly LoginInputItem[];
  }
>;
