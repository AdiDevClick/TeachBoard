import type { LoginForm } from "@/components/LoginForms/LoginForm.tsx";
import type { PasswordCreation } from "@/pages/Password/PasswordCreation.tsx";
import type { Signup } from "@/pages/Signup/Signup.tsx";

/**
 * Input controllers for forms components.
 *
 * @description All arrays MUST be set to `satisfies Parameters<typeof MyFormComponent>[0]["inputControllers"];' to ensure proper typing.
 */

/** Login page controllers  */
export const inputLoginControllers = [
  {
    name: "identifier",
    title: "Identifiant",
    type: "text",
    placeholder: "m@example.com",
  },
  {
    name: "password",
    title: "Mot de passe",
    type: "password",
    placeholder: "********",
  },
] satisfies Parameters<typeof LoginForm>[0]["inputControllers"];

/** Signup page controllers  */
export const inputSignupControllers = [
  {
    name: "email",
    title: "Votre adresse e-mail",
    type: "email",
    placeholder: "m@example.com",
  },
  {
    name: "username",
    title: "Votre nom d'utilisateur",
    type: "text",
    placeholder: "John Doe",
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
