import { formsRegex } from "@/configs/formsRegex.config.ts";
import type { FetchingInputItem } from "@/types/AppInputControllerInterface";
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
  criteriasRequiredMessage:
    "Une justification est requise pour chaque palier de note.",
  criteriaRegexMessage:
    "La description de chaque critère ne peut pas être vide et doit respecter le format requis.",
  criteriasLengthMessage:
    "Les 5 paliers (100, 75, 50, 25, 0) doivent etre renseignés.",
  criteriasDescriptionRequiredMessage:
    "Chaque palier doit contenir une description.",
  criteriasDescriptionMaxLength: 500,
  criteriasDescriptionMaxLengthMessage:
    "Une justification ne peut pas dépasser 500 caractères.",
  criteriasScoreInvalidMessage:
    "Les scores autorisés sont 100, 75, 50, 25 et 0.",
};

export const DEGREE_MODULE_SKILL_REQUIRED_SCORES = Object.freeze([
  100, 75, 50, 25, 0,
]);

const scoreJustificationSchema = z.object({
  score: z
    .number()
    .int()
    .min(0, data.criteriasScoreInvalidMessage)
    .max(100, data.criteriasScoreInvalidMessage),
  description: z
    .string()
    .trim()
    .regex(formsRegex.serverDescription, data.criteriaRegexMessage)
    .min(1, data.criteriasDescriptionRequiredMessage)
    .max(
      data.criteriasDescriptionMaxLength,
      data.criteriasDescriptionMaxLengthMessage,
    ),
});

export const createDefaultDegreeModuleSkillJustifications = () =>
  DEGREE_MODULE_SKILL_REQUIRED_SCORES.map((score) => ({
    score,
    description: "",
  }));

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
  criterias: z
    .array(scoreJustificationSchema)
    .min(
      DEGREE_MODULE_SKILL_REQUIRED_SCORES.length,
      data.criteriasLengthMessage,
    )
    .max(
      DEGREE_MODULE_SKILL_REQUIRED_SCORES.length,
      data.criteriasLengthMessage,
    ),
});

export type DegreeModuleSkillFormSchema = z.infer<typeof moduleSkillSchema>;

export type DegreeModuleSkillInputItem =
  FetchingInputItem<DegreeModuleSkillFormSchema>;
export default moduleSkillSchema;
