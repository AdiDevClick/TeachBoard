import type { RecoveryFormSchema } from "@/features/auth/components/login/models/login.models";
import type { PasswordCreation } from "@/pages/Password/PasswordCreation.tsx";
import type { Signup } from "@/pages/Signup/Signup.tsx";
import type { InputItem } from "@/types/AppInputControllerInterface";

/**
 * Input controllers for forms components.
 *
 * @description All arrays MUST be set to `satisfies Parameters<typeof MyFormComponent>[0]["inputControllers"];' to ensure proper typing.
 */

/** Signup page controllers  */
export const inputSignupControllers = [
  {
    name: "email",
    title: "Votre adresse e-mail",
    type: "email",
    placeholder: "m@example.com",
    autoComplete: "email",
  },
  {
    name: "username",
    title: "Votre nom d'utilisateur",
    type: "text",
    placeholder: "John Doe",
    autoComplete: "username",
  },
] satisfies Parameters<typeof Signup>[0]["inputControllers"];

/** Password creation page controllers  */
export const passwordCreationInputControllers = [
  {
    name: "password",
    title: "Nouveau mot de passe",
    type: "password",
    placeholder: "********",
  },
  {
    name: "passwordConfirmation",
    title: "Confirmer le mot de passe",
    type: "password",
    placeholder: "********",
  },
] satisfies Parameters<typeof PasswordCreation>[0]["inputControllers"];

/** Password recovery page controllers  */
export const passwordRecoveryInputControllers = [
  {
    name: "identifier",
    title: "Votre adresse e-mail",
    type: "email",
    placeholder: "m@example.com",
    autoComplete: "email",
  },
] satisfies InputItem<RecoveryFormSchema>[];
