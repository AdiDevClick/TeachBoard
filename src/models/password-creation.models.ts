import z from "zod";

/** Validation schema for the password creation form */
export const pwCreationSchema = z
  .object({
    password: z
      .string()
      .min(8, "Le mot de passe doit contenir au moins 8 caractères.")
      .max(100, "Le mot de passe ne peut contenir plus de 100 caractères.")
      .refine(
        (val) => /[A-Z]/.test(val),
        "Le mot de passe doit contenir au moins une lettre majuscule."
      )
      .refine(
        (val) => /[a-z]/.test(val),
        "Le mot de passe doit contenir au moins une lettre minuscule."
      )
      .refine(
        (val) => /\d/.test(val),
        "Le mot de passe doit contenir au moins un chiffre."
      )
      .refine(
        (val) => /[!@#$%^&*(),.?":{}|<>]/.test(val),
        "Le mot de passe doit contenir au moins un caractère spécial."
      )
      .nonempty("Le mot de passe est requis."),
    passwordConfirmation: z
      .string()
      .nonempty("La confirmation du mot de passe est requise."),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "Les mots de passe ne correspondent pas.",
    path: ["passwordConfirmation"],
  })
  .strict();
