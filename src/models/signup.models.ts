import { formsRegex } from "@/configs/formsRegex.config.ts";
import z from "zod";

/** Validation schema for the signup form */
export const signupSchema = z.object({
  email: z
    .email("Veuillez entrer une adresse e-mail valide.")
    .max(100, "L'adresse e-mail ne peut contenir plus de 100 caractères.")
    .nonempty("L'identifiant est requis.")
    .transform((v) => v.trim().toLowerCase()),
  username: z
    .string()
    .min(3, "Le nom d'utilisateur doit contenir au moins 3 caractères.")
    .max(30, "Le nom d'utilisateur ne peut contenir plus de 30 caractères.")
    .nonempty("Le nom d'utilisateur est requis.")
    .regex(
      formsRegex.serverUsername,
      "Le nom d'utilisateur ne peut contenir que des lettres, des chiffres et des underscores."
    )
    .transform((v) => v.trim().toLowerCase()),
});
