import type { InputItem } from "@/components/Inputs/types/inputs.types.ts";
import { formsRegex } from "@/configs/formsRegex.config.ts";
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
const skillCreationSchema = (data: typeof fieldData) => {
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
    skills: z
      .array(
        z
          .string()
          .regex(
            formsRegex.noSpecialCharsWithTwoCharMin,
            data.arrayItemRegexMessage
          )
          .trim()
      )
      .max(data.maxArrayLength, data.maxArrayLengthExceededMessage)
      .nonoptional(),
  });
};

const diplomaSkillData = skillCreationSchema(fieldData);

export type DegreeSkillFormSchema = z.infer<typeof diplomaSkillData>;

export type DegreeSkillInputItem = InputItem<DegreeSkillFormSchema>;

export { diplomaSkillData };
