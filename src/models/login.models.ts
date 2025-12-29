import type { InputItem } from "@/components/Inputs/types/inputs.types.ts";
import { formsRegex } from "@/configs/formsRegex.config.ts";
import type { pwRecoverySchema } from "@/models/pw-recovery.model.ts";
import z from "zod";

/** Validation schema for the login form */
export const formSchema = z.object({
  identifier: z
    .string()
    .min(3, "Votre identifiant doit contenir au moins 3 caractères.")
    .max(64, "Votre identifiant ne peut contenir plus de 64 caractères.")
    .nonempty("L'identifiant est requis.")
    // .transform((val) => {
    //   let cleaned = val;
    //   try {
    //     cleaned = cleaned.normalize("NFKD");
    //     cleaned = cleaned.replaceAll(/[\u0300-\u036f]/g, "");
    //   } catch {
    //     /* ignore if normalize not supported */
    //   }

    //   const pattern = cleaned.includes("@")
    //     ? formsRegex.allowedCharsEmailRemove
    //     : formsRegex.allowedCharsUsernameRemove;
    //   return cleaned.replaceAll(pattern, "");
    // })
    .superRefine((val, ctx) => {
      if (val.includes("@")) {
        if (!formsRegex.serverEmail.test(val)) {
          ctx.addIssue({
            code: "custom",
            message: "Veuillez entrer une adresse email valide.",
          });
        }
      }
    })
    .toLowerCase(),
  // .transform((v) => v.trim().toLowerCase()),
  password: z
    .string()
    .min(1, "Votre mot de passe doit contenir au moins 1 caractère.")
    .max(100, "Votre mot de passe ne peut contenir plus de 100 caractères.")
    .nonempty("Le mot de passe est requis."),
});

export type LoginFormSchema = z.infer<typeof formSchema>;

export type RecoveryFormSchema = z.infer<typeof pwRecoverySchema>;

export type LoginInputItem = InputItem<LoginFormSchema>;
