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
  criterionRequiredMessage:
    "Un critère est requise pour chaque palier de note.",
  criterionRegexMessage:
    "La description de chaque critère ne peut pas être vide et doit respecter le format requis.",
  criteriaLengthMessage:
    "Les 5 paliers (100, 75, 50, 25, 0) doivent etre renseignés.",
  criterionMaxLength: 500,
  criterionMaxLengthMessage: "Un critère ne peut pas dépasser 500 caractères.",
  criterionScoreInvalidMessage:
    "Les scores autorisés sont 100, 75, 50, 25 et 0.",
};

export const DEGREE_MODULE_SKILL_REQUIRED_SCORES = Object.freeze([
  100, 75, 50, 25, 0,
]);

const scoreJustificationSchema = (data: typeof fieldData) =>
  z.object({
    score: z
      .number()
      .min(0, data.criterionScoreInvalidMessage)
      .max(100, data.criterionScoreInvalidMessage),
    criterion: z
      .string()
      .trim()
      .regex(formsRegex.serverDescription, data.criterionRegexMessage)
      .min(1, data.criterionRequiredMessage)
      .max(data.criterionMaxLength, data.criterionMaxLengthMessage),
  });

export const createDefaultDegreeModuleSkillJustifications = () =>
  DEGREE_MODULE_SKILL_REQUIRED_SCORES.map((score) => ({
    score,
    criterion: "",
  }));

/**
 * Schema for degree skill creation form validation.
 */
const moduleSkillForm = (data: typeof fieldData) =>
  z.object({
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
    criteria: z
      .array(scoreJustificationSchema(data))
      .min(
        DEGREE_MODULE_SKILL_REQUIRED_SCORES.length,
        data.criteriaLengthMessage,
      )
      .max(
        DEGREE_MODULE_SKILL_REQUIRED_SCORES.length,
        data.criteriaLengthMessage,
      ),
  });

export type DegreeModuleSkillFormSchema = z.infer<typeof moduleSkillSchema>;

export type DegreeModuleSkillInputItem =
  FetchingInputItem<DegreeModuleSkillFormSchema>;
export const moduleSkillSchema = moduleSkillForm(fieldData);
