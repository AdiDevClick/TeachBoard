import LoginView from "@/features/auth/components/login/LoginView";

/**
 * Login Component Props
 */

/**
 * {@link Login}'s props will allways match {@link LoginView}'s inputControllers prop.
 */
export type LoginPageProps = Readonly<{
  inputControllers?: Parameters<typeof LoginView>[0]["inputControllers"];
}>;
