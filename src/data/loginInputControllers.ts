import type { LoginInputItem } from "@/components/LoginForms/types/LoginFormsTypes.ts";

/**
 * Input controllers for the login form.
 */
export const inputControllers: LoginInputItem[] = [
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
];
