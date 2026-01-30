import type { InputItem } from "@/components/Inputs/types/inputs.types.ts";
import { formsRegex } from "@/configs/formsRegex.config.ts";
import z from "zod";

const data = {
  nameMinLength: 3,
  nameMaxLength: 100,
  nameMinLengthMessage:
    "Le nom de la tâche doit contenir au moins 3 caractères.",
  nameMaxLengthMessage:
    "Le nom de la tâche ne peut pas dépasser 100 caractères.",
  descriptionMinLength: 10,
  descriptionMaxLength: 1000,
  descriptionMinLengthMessage:
    "La description de la tâche doit contenir au moins 10 caractères.",
  descriptionMaxLengthMessage:
    "La description de la tâche ne peut pas dépasser 1000 caractères.",
  regexNameMessage:
    "Le nom de la tâche ne doit pas contenir de caractères spéciaux.",
  regexDescriptionMessage:
    "La description de la tâche ne doit pas contenir de caractères spéciaux.",
};

/**
 * Zod schema for task item creation form validation.
 */
export const taskItemCreationSchema = z.object({
  name: z
    .string()
    .nonempty(data.nameMinLengthMessage)
    .max(data.nameMaxLength, data.nameMaxLengthMessage)
    .min(data.nameMinLength, data.nameMinLengthMessage)
    .regex(formsRegex.serverName, {
      message: data.regexNameMessage,
    })
    .trim()
    .toLowerCase()
    .describe("Name of the task"),
  description: z
    .string()
    .nonempty(data.descriptionMinLengthMessage)
    .max(data.descriptionMaxLength, data.descriptionMaxLengthMessage)
    .min(data.descriptionMinLength, data.descriptionMinLengthMessage)
    .regex(formsRegex.serverDescription, {
      message: data.regexDescriptionMessage,
    })
    .trim()
    .toLowerCase()
    .describe("Description of the task"),
});

export type TaskItemFormSchema = z.infer<typeof taskItemCreationSchema>;

export type TaskItemCreationInputItem = InputItem<TaskItemFormSchema>;
