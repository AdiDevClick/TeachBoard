import type { InputItem } from "@/components/Inputs/types/inputs.types.ts";
import { formsRegex } from "@/configs/formsRegex.config.ts";
import z from "zod";

const data = {
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
};

/**
 * Schema for degree skill creation form validation.
 */
const moduleSkillSchema = z.object({
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
});

export type DegreeModuleSkillFormSchema = z.infer<typeof moduleSkillSchema>;
export type DegreeModuleSkillInputItem = InputItem<DegreeModuleSkillFormSchema>;
export default moduleSkillSchema;
