import type { InputItem } from "@/types/AppInputControllerInterface";
import z from "zod";

const fieldData = {
  identifierMinErrorMessage:
    "Votre identifiant doit contenir au moins 5 caractères.",
  identifierMaxErrorMessage:
    "Votre identifiant ne peut contenir plus de 64 caractères.",
  identifierRequiredErrorMessage: "L'adresse email est requise.",
  invalidEmailErrorMessage: "Veuillez entrer une adresse email valide.",
};

/** Validation schema for the password recovery form */
export const pwRecoverySchema = (data: typeof fieldData) =>
  z.object({
    identifier: z
      .email(data.invalidEmailErrorMessage)
      .min(5, data.identifierMinErrorMessage)
      .max(254, data.identifierMaxErrorMessage)
      .nonempty(data.identifierRequiredErrorMessage)
      .toLowerCase(),
  });

export type PwRecoveryFormSchema = z.infer<typeof pwRecoveryFormSchema>;

export const pwRecoveryFormSchema = pwRecoverySchema(fieldData);

export type PwRecoveryInputItem = InputItem<PwRecoveryFormSchema>;
