import type { LoginInputItem } from "@/features/auth/components/login/models/login.models";
import type { PageWithControllers } from "@/types/AppPagesInterface";

/**
 * @filedescription Types for the LoginView component, which renders the login form and the password recovery form based on the state.
 */

/**
 *  Props for the LoginView component, which renders the login form and the password recovery form based on the state.
 */
export type LoginViewProps = Readonly<PageWithControllers<LoginInputItem>>;
