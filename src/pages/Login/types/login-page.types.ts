import type { LoginForm } from "@/components/LoginForms/LoginForm.tsx";
import type { Login } from "@/pages/Login/Login.tsx";

/**
 * Login Component Props
 */

/**
 * {@link Login}'s props will allways match {@link LoginForm}'s inputControllers prop.
 */
export type LoginPageProps = Readonly<{
  inputControllers?: Parameters<typeof LoginForm>[0]["inputControllers"];
}>;
