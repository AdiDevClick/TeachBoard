import z from "zod";

/** Validation schema for the password recovery form */
export const pwRecoverySchema = z.object({
  identifier: z
    .email("Veuillez entrer une adresse email valide.")
    .min(5, "L'adresse email doit contenir au moins 5 caractères.")
    .max(254, "L'adresse email ne peut contenir plus de 254 caractères.")
    .nonempty("L'adresse email est requise.")
    .transform((v) => v.trim().toLowerCase()),
});
