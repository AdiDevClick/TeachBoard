import type { InputItem } from "@/components/Inputs/types/inputs.types.ts";
import { formsRegex } from "@/configs/formsRegex.config.ts";
import z from "zod";

const fieldData = {
  diplomaValidUuidMessage: "Le diplôme doit être un UUID valide.",
  schoolYearValidUuidMessage: "L'année scolaire doit être un UUID valide.",
  schoolLevelValidUuidMessage: "Le niveau scolaire doit être un UUID valide.",
  diplomaRequiredMessage: "Le diplôme est requis.",
  schoolYearRequiredMessage: "L'année scolaire est requise.",
  schoolLevelRequiredMessage: "Le niveau scolaire est requis.",
  minArrayLength: 1,
  minArrayLengthMessage: "Au moins un module doit être ajouté.",
  maxArrayLength: 1000,
  maxArrayLengthExceededMessage:
    "La liste de modules ne peut pas dépasser 1000 éléments.",
  arrayItemRegexMessage:
    "Les modules ne doivent pas contenir de caractères spéciaux.",
};

export const diplomaCreationSchema = z.object({
  diplomaFieldId: z
    .uuid(fieldData.diplomaValidUuidMessage)
    .trim()
    .nonempty(fieldData.diplomaRequiredMessage),
  yearId: z
    .uuid(fieldData.schoolYearValidUuidMessage)
    .trim()
    .nonempty(fieldData.schoolYearRequiredMessage),
  levelId: z
    .uuid(fieldData.schoolLevelValidUuidMessage)
    .trim()
    .nonempty(fieldData.schoolLevelRequiredMessage),
  mainSkillsList: z
    .array(
      z
        .string()
        .regex(
          formsRegex.noSpecialCharsWithTwoCharMin,
          fieldData.arrayItemRegexMessage
        )
        .trim()
        .toUpperCase()
    )
    .min(fieldData.minArrayLength, fieldData.minArrayLengthMessage)
    .max(fieldData.maxArrayLength, fieldData.maxArrayLengthExceededMessage)
    .nonoptional(),
});

export type DiplomaCreationFormSchema = z.infer<typeof diplomaCreationSchema>;

export type DiplomaInputItem = InputItem<DiplomaCreationFormSchema>;
