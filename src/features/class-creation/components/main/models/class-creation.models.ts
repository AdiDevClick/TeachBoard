import { formsRegex } from "@/configs/formsRegex.config.ts";
import type { FetchingInputItem } from "@/types/AppInputControllerInterface";
import { z } from "zod";

const fieldData = {
  nameInvalidCharsMessage:
    "Le nom de classe ne peut contenir que des lettres, des chiffres, des espaces, des tirets et des underscores.",
  nameMinCharsMessage:
    "Un nom de classe ayant au moins un caractère est requis.",
  nameMaxCharsMessage:
    "Votre nom de classe ne peut contenir plus de 32 caractères.",
  nameRequiredMessage: "Un nom de classe est requis.",
  descriptionInvalidCharsMessage:
    "La description ne peut contenir que des lettres, des chiffres, des espaces, des tirets et des underscores.",
  descriptionMaxCharsMessage:
    "Votre description ne peut contenir plus de 256 caractères.",
  schoolYearRequiredMessage: "Une année scolaire est requise.",
  schoolYearFormatMessage:
    "Le format de l'année scolaire doit être AAAA - AAAA.",
  degreeConfigIdUUIDMessage:
    "L'identifiant de configuration de diplôme doit être un UUID valide.",
  degreeConfigIdRequiredMessage:
    "Un identifiant de configuration de diplôme est requis.",
  userIdUUIDMessage: "L'identifiant utilisateur doit être un UUID valide.",
  userIdRequiredMessage: "Un identifiant utilisateur est requis.",
  primaryTeacherIdUUIDMessage:
    "L'identifiant de l'enseignant principal doit être un UUID valide.",
  taskIdUUIDMessage: "L'identifiant de la tâche doit être un UUID valide.",
  tasksNonEmptyMessage: "Au moins une tâche doit être sélectionnée.",
  studentIdUUIDMessage: "L'identifiant de l'étudiant doit être un UUID valide.",
  studentsNonEmptyMessage: "Au moins un étudiant doit être sélectionné.",
  studentsMaxLengthMessage:
    "Vous ne pouvez sélectionner que jusqu'à 50 étudiants.",
};

/**
 * Schema for class creation form validation
 *
 * name: Required string, converted to lowercase and trimmed.
 * description: Optional string up to 256 characters, trimmed.
 */
const classCreationForm = (data: typeof fieldData) =>
  z.object({
    name: z
      .string()
      .trim()
      .regex(formsRegex.serverDescription, data.nameInvalidCharsMessage)
      .min(1, data.nameMinCharsMessage)
      .max(32, data.nameMaxCharsMessage)
      .nonempty(data.nameRequiredMessage)
      .toLowerCase()
      .describe("class name, converted to lowercase and trimmed"),
    description: z
      .string()
      .trim()
      .regex(formsRegex.serverDescription, data.descriptionInvalidCharsMessage)
      .max(256, data.descriptionMaxCharsMessage)
      .optional()
      .describe("class description, optional, trimmed"),
    schoolYear: z
      .string()
      .nonempty(data.schoolYearRequiredMessage)
      .refine(
        (value) => formsRegex.viewYearRange.test(value),
        data.schoolYearFormatMessage,
      )
      .transform((value) =>
        value
          .split(" - ")
          .map((s) => s.trim())
          .join("-"),
      )
      .refine(
        (value) => formsRegex.serverYearRange.test(value),
        data.schoolYearFormatMessage,
      ),
    degreeConfigId: z
      .uuid(data.degreeConfigIdUUIDMessage)
      .nonempty(data.degreeConfigIdRequiredMessage),
    userId: z.uuid(data.userIdUUIDMessage).nonempty(data.userIdRequiredMessage),
    primaryTeacherId: z
      .string()
      .optional()
      .transform((value) => (value === "" ? undefined : value))
      .pipe(z.uuid(data.primaryTeacherIdUUIDMessage).optional()),
    tasks: z
      .array(z.uuid(data.taskIdUUIDMessage))
      .nonempty(data.tasksNonEmptyMessage),
    students: z
      .array(z.uuid(data.studentIdUUIDMessage))
      .nonempty(data.studentsNonEmptyMessage)
      .min(1, data.studentsNonEmptyMessage)
      .max(50, data.studentsMaxLengthMessage)
      .nonoptional()
      .describe("Identifiant unique pour l'étudiant"),
  });

export type ClassCreationFormSchema = z.infer<typeof classCreationSchema>;

export type ClassCreationInputItem = FetchingInputItem<ClassCreationFormSchema>;

export const classCreationSchema = classCreationForm(fieldData);
