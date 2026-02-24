import type LoginView from "@/features/auth/components/login/LoginView";

/** Login page controllers  */
export const inputLoginControllers = [
  {
    name: "identifier",
    title: "Identifiant",
    type: "text",
    placeholder: "m@example.com",
    autoComplete: "username",
  },
  {
    name: "password",
    title: "Mot de passe",
    type: "password",
    placeholder: "********",
    autoComplete: "current-password",
  },
] satisfies Parameters<typeof LoginView>[0]["inputControllers"];
