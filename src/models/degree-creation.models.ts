import type { InputItem } from "@/components/Inputs/types/inputs.types.ts";
import { formsRegex } from "@/configs/formsRegex.config.ts";
import z from "zod";

const fieldData = {
  nameRequiredMessage:
    "Le nom du domaine pour le diplôme est requis. Ex: 'Cuisine', 'Développeur', 'Boucherie'...",
  codeRequiredMessage: "Le code du diplôme est requis.",
  maxLength: 255,
  maxLengthExceededMessage:
    "Le nom du diplôme ne peut pas dépasser 255 caractères.",
  maxCodeLength: 10,
  maxCodeLengthExceededMessage:
    "Le code du diplôme ne peut pas dépasser 10 caractères.",
  nameRegexMessage:
    "Le nom du diplôme ne doit pas contenir de caractères spéciaux.",
  codeRegexMessage:
    "Le code du diplôme ne doit pas contenir de caractères spéciaux.",
  maxDescriptionLength: 255,
  maxDescriptionLengthExceededMessage:
    "La description du diplôme ne peut pas dépasser 255 caractères.",
  descriptionRegexMessage:
    "La description du diplôme ne doit pas contenir de caractères spéciaux.",
};

const yearData = {
  nameRequiredMessage:
    'L\'année du diplôme est requise. Ex: "Première", "Terminale"...',
  maxLength: 25,
  maxLengthExceededMessage:
    "Le nom de l'année du diplôme ne peut pas dépasser 255 caractères.",
  codeRequiredMessage: "Le code de l'année du diplôme est requis.",
  maxCodeLength: 10,
  maxCodeLengthExceededMessage:
    "Le code de l'année du diplôme ne peut pas dépasser 10 caractères.",
  nameRegexMessage:
    "Le nom de l'année du diplôme ne doit pas contenir de caractères spéciaux.",
  codeRegexMessage:
    "Le code de l'année du diplôme ne doit pas contenir de caractères spéciaux.",
  maxDescriptionLength: 255,
  maxDescriptionLengthExceededMessage:
    "La description de l'année du diplôme ne peut pas dépasser 255 caractères.",
  descriptionRegexMessage:
    "La description de l'année du diplôme ne doit pas contenir de caractères spéciaux.",
};

const levelData = {
  nameRequiredMessage:
    'Le niveau du diplôme est requis. Ex: "Niveau 1", "Niveau 2"...',
  maxLength: 25,
  maxLengthExceededMessage:
    "Le nom du niveau du diplôme ne peut pas dépasser 255 caractères.",
  codeRequiredMessage: "Le code du niveau du diplôme est requis.",
  maxCodeLength: 10,
  maxCodeLengthExceededMessage:
    "Le code du niveau du diplôme ne peut pas dépasser 10 caractères.",
  nameRegexMessage:
    "Le nom du niveau du diplôme ne doit pas contenir de caractères spéciaux.",
  codeRegexMessage:
    "Le code du niveau du diplôme ne doit pas contenir de caractères spéciaux.",
  maxDescriptionLength: 255,
  maxDescriptionLengthExceededMessage:
    "La description du niveau du diplôme ne peut pas dépasser 255 caractères.",
  descriptionRegexMessage:
    "La description du niveau du diplôme ne doit pas contenir de caractères spéciaux.",
};

/**
 * Schema for degree field, year and level creation form validation
 *
 * @param data - Object containing validation messages and constraints
 */
const degreeCreationSchema = (data: typeof fieldData) => {
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
    description: z
      .string()
      .max(data.maxDescriptionLength, data.maxDescriptionLengthExceededMessage)
      .regex(formsRegex.serverName, data.descriptionRegexMessage)
      .trim()
      .toLowerCase()
      .optional(),
  });
};

const diplomaFieldData = degreeCreationSchema(fieldData);
const diplomaYearData = degreeCreationSchema(yearData);
const diplomaLevelData = degreeCreationSchema(levelData);

export type DegreeCreationFormSchema = z.infer<typeof diplomaFieldData>;

export type DegreeCreationInputItem = InputItem<DegreeCreationFormSchema>;

export { diplomaFieldData, diplomaLevelData, diplomaYearData };
