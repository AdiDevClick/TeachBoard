import type LoginForm from "@/features/login/components/main/LoginForm.tsx";

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
] satisfies Parameters<typeof LoginForm>[0]["inputControllers"];
