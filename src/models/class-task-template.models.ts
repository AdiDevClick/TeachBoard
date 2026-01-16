import type { FetchingInputItem } from "@/components/Inputs/types/inputs.types.ts";
import z from "zod";

const dataField = {
  nameRequiredMessage: "Le nom de la tâche est requis.",
  nameMinLength: 2,
  nameMaxLength: 64,
  nameMinLengthMessage:
    "Le nom de la tâche doit contenir au moins 2 caractères.",
  nameMaxLengthMessage:
    "Le nom de la tâche ne peut pas dépasser 64 caractères.",
  descriptionRequiredMessage: "La description de la tâche est requise.",
  descriptionMinLength: 10,
  descriptionMaxLength: 512,
  descriptionMinLengthMessage:
    "La description de la tâche doit contenir au moins 10 caractères.",
  descriptionMaxLengthMessage:
    "La description de la tâche ne peut pas dépasser 512 caractères.",
  arrayItemRegexMessage:
    "Les compétences ne doivent pas contenir de caractères spéciaux.",
  taskValidUuidMessage: "La tâche doit être un UUID valide.",
  degreeConfigValidUuidMessage:
    "La configuration de diplôme doit être un UUID valide.",
  taskRequiredMessage: "La tâche associée est requise.",
  degreeConfigRequiredMessage: "La configuration de diplôme est requise.",
  skillsRequiredMessage: "Les compétences associées sont requises.",
  skillsValidUuidMessage: "Les compétences doivent être des UUIDs valides.",
};

const taskTemplateCreationSchema = (data: typeof dataField) =>
  z.object({
    name: z
      .string()
      .nonempty(data.nameMinLengthMessage)
      .max(data.nameMaxLength, data.nameMaxLengthMessage)
      .min(data.nameMinLength, data.nameMinLengthMessage)
      .trim()
      .toLowerCase()
      .describe("Title of the task"),
    description: z
      .string()
      .nonempty(data.descriptionMinLengthMessage)
      .max(data.descriptionMaxLength, data.descriptionMaxLengthMessage)
      .min(data.descriptionMinLength, data.descriptionMinLengthMessage)
      .trim()
      .toLowerCase()
      .describe("Description of the task"),
    taskId: z
      .uuid(data.taskValidUuidMessage)
      .nonempty(data.taskRequiredMessage)
      .trim()
      .describe("Unique identifier for an already created task"),
    degreeConfigId: z
      .uuid(data.degreeConfigValidUuidMessage)
      .trim()
      .nonempty(data.degreeConfigRequiredMessage)
      .describe("Unique identifier for the diploma associated with the task"),
    modules: z
      .array(
        z.object({
          moduleId: z.uuid(data.skillsValidUuidMessage),
          subSkillId: z.array(z.uuid(data.skillsValidUuidMessage)),
        })
      )
      .nonempty(data.skillsRequiredMessage)
      .describe("List of skills associated with the task"),
  });

// skills like : [ { moduleId: uuid, subSkillId: [ uuid, uuid ] }, { moduleId: uuid, subSkillId: [ uuid, uuid ] } ]

export type TaskTemplateCreationFormSchema = z.infer<typeof taskTemplateSchema>;

export type TaskTemplateCreationInputItem =
  FetchingInputItem<TaskTemplateCreationFormSchema>;

export const taskTemplateSchema = taskTemplateCreationSchema(dataField);
