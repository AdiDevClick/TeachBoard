import { formsRegex } from "@/configs/formsRegex.config.ts";
import type { FetchingInputItem } from "@/types/AppInputControllerInterface";
import z from "zod";

const fieldData = {
  nameRequiredMessage:
    "Le nom de la compétence est requis. Ex: 'Cuisine', 'Développement', 'Boucherie'...",
  codeRequiredMessage: "Le code de la compétence est requis.",
  maxLength: 255,
  maxLengthExceededMessage:
    "Le nom de la compétence ne peut pas dépasser 255 caractères.",
  maxCodeLength: 10,
  maxCodeLengthExceededMessage:
    "Le code de la compétence ne peut pas dépasser 10 caractères.",
  nameRegexMessage:
    "Le nom de la compétence ne doit pas contenir de caractères spéciaux.",
  codeRegexMessage:
    "Le code de la compétence ne doit pas contenir de caractères spéciaux.",
  minArrayLength: 1,
  minArrayLengthMessage: "Au moins une compétence doit être ajoutée.",
  maxArrayLength: 1000,
  maxArrayLengthExceededMessage:
    "La description du diplôme ne peut pas dépasser 1000 caractères.",
  arrayItemRegexMessage:
    "Les compétences ne doivent pas contenir de caractères spéciaux.",
};

/**
 * Schema for degree skill creation form validation.
 *
 * @param data - Object containing validation messages and constraints
 */
const moduleCreationSchema = (data: typeof fieldData) => {
  return z.object({
    name: z
      .string()
      .min(1, data.nameRequiredMessage)
      .max(data.maxLength, data.maxLengthExceededMessage)
      .regex(formsRegex.serverName, data.nameRegexMessage)
      .toLowerCase()
      .trim()
      .nonoptional(),
    code: z
      .string()
      .min(1, data.codeRequiredMessage)
      .max(data.maxCodeLength, data.maxCodeLengthExceededMessage)
      .regex(formsRegex.noSpecialCharsWithTwoCharMin, data.codeRegexMessage)
      .toUpperCase()
      .trim()
      .nonoptional(),
    skillList: z
      .array(
        z
          .string()
          .regex(
            formsRegex.noSpecialCharsWithTwoCharMin,
            data.arrayItemRegexMessage,
          )
          .trim()
          .toUpperCase(),
      )
      .min(data.minArrayLength, data.minArrayLengthMessage)
      .max(data.maxArrayLength, data.maxArrayLengthExceededMessage)
      .nonoptional(),
  });
};

export type DegreeModuleFormSchema = z.infer<typeof degreeModuleData>;

export type DegreeModuleInputItem = FetchingInputItem<DegreeModuleFormSchema>;

export const degreeModuleData = moduleCreationSchema(fieldData);
