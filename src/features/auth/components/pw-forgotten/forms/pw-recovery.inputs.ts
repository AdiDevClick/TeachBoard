import type { PwRecoveryInputItem } from "@/features/auth/components/pw-forgotten/models/pw-recovery.model";

/** Password recovery page controllers  */
export const passwordRecoveryInputControllers = [
  {
    name: "identifier",
    title: "Votre adresse e-mail",
    type: "email",
    placeholder: "m@example.com",
    autoComplete: "email",
  },
] satisfies PwRecoveryInputItem[];
