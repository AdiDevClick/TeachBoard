import type { FetchingInputItem } from "@/components/Inputs/types/inputs.types.ts";
import { z } from "zod";

export type ClassCreationFormSchema = z.infer<typeof classCreationSchema>;

export type ClassCreationInputItem = FetchingInputItem<ClassCreationFormSchema>;

/**
 * Schema for class creation form validation
 *
 * name: Required string, converted to lowercase and trimmed.
 * description: Optional string up to 256 characters, trimmed.
 */
export const classCreationSchema = z.object({
  name: z
    .string()
    .min(1, "Un nom de classe ayant au moins un caractère est requis.")
    .max(32, "Votre nom de classe ne peut contenir plus de 32 caractères.")
    .nonempty("Un nom de classe est requis.")
    .toLowerCase()
    .trim(),
  description: z
    .string()
    .max(256, "Votre description ne peut contenir plus de 256 caractères.")
    .trim()
    .optional(),
  schoolYear: z
    .string()
    .nonempty("Une année scolaire est requise.")
    .regex(
      /^\d{4} - \d{4}$/,
      "Le format de l'année scolaire doit être AAAA - AAAA."
    )
    .trim(),
  degreeConfigId: z
    .uuid("L'identifiant de configuration de diplôme doit être un UUID valide.")
    .nonempty("Un identifiant de configuration de diplôme est requis."),
  userId: z
    .uuid("L'identifiant utilisateur doit être un UUID valide.")
    .nonempty("Un identifiant utilisateur est requis."),
  primaryTeacherId: z
    .string()
    .optional()
    .transform((value) => (value === "" ? undefined : value))
    .pipe(
      z
        .uuid(
          "L'identifiant de l'enseignant principal doit être un UUID valide."
        )
        .optional()
    ),
  tasks: z
    .array(z.uuid("L'identifiant de la tâche doit être un UUID valide."))
    .nonempty("Au moins une tâche est requise."),
  students: z
    .array(z.uuid("L'identifiant de l'élève doit être un UUID valide."))
    .nonempty("La liste des étudiants ne peut pas être vide.")
    .min(1, "La liste des étudiants ne peut pas être vide.")
    .max(50, "La liste des étudiants ne peut pas dépasser 50 éléments.")
    .nonoptional()
    .describe("Identifiant unique pour l'étudiant"),
});
