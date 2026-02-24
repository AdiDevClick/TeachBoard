import { formsRegex } from "@/configs/formsRegex.config.ts";
import type { InputItem } from "@/types/AppInputControllerInterface";
import z from "zod";

const fieldData = {
  identifierMinErrorMessage:
    "Votre identifiant doit contenir au moins 3 caractères.",
  identifierMaxErrorMessage:
    "Votre identifiant ne peut contenir plus de 64 caractères.",
  identifierRequiredErrorMessage: "L'identifiant est requis.",
  passwordMinErrorMessage:
    "Votre mot de passe doit contenir au moins 1 caractère.",
  passwordMaxErrorMessage:
    "Votre mot de passe ne peut contenir plus de 100 caractères.",
  passwordRequiredErrorMessage: "Le mot de passe est requis.",
  invalidEmailErrorMessage: "Veuillez entrer une adresse email valide.",
};

/** Validation schema for the login form */
export const formSchema = (data: typeof fieldData) =>
  z.object({
    identifier: z
      .string()
      .min(3, data.identifierMinErrorMessage)
      .max(64, data.identifierMaxErrorMessage)
      .nonempty(data.identifierRequiredErrorMessage)
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
              message: fieldData.invalidEmailErrorMessage,
            });
          }
        }
      })
      .toLowerCase(),
    // .transform((v) => v.trim().toLowerCase()),
    password: z
      .string()
      .min(1, data.passwordMinErrorMessage)
      .max(100, data.passwordMaxErrorMessage)
      .nonempty(data.passwordRequiredErrorMessage),
  });

export const loginFormSchema = formSchema(fieldData);

export type LoginFormSchema = z.infer<typeof loginFormSchema>;

export type LoginInputItem = InputItem<LoginFormSchema>;
