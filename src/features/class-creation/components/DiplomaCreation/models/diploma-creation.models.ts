import type { FetchingInputItem } from "@/components/Inputs/types/inputs.types.ts";
import type { DynamicTagsItemList } from "@/components/Tags/types/tags.types.ts";
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

const diplomaSchema = (data: typeof fieldData) => {
  return z.object({
    diplomaFieldId: z
      .uuid(data.diplomaValidUuidMessage)
      .trim()
      .nonempty(data.diplomaRequiredMessage),
    yearId: z
      .uuid(data.schoolYearValidUuidMessage)
      .trim()
      .nonempty(data.schoolYearRequiredMessage),
    levelId: z
      .uuid(data.schoolLevelValidUuidMessage)
      .trim()
      .nonempty(data.schoolLevelRequiredMessage),
    modulesList: z
      .array(
        z
          .string()
          .regex(formsRegex.skillId, data.arrayItemRegexMessage)
          .trim()
          .toUpperCase(),
      )
      .min(data.minArrayLength, data.minArrayLengthMessage)
      .max(data.maxArrayLength, data.maxArrayLengthExceededMessage)
      .nonoptional(),
  });
};

export type DiplomaCreationFormSchema = z.infer<typeof diplomaCreationSchema>;

export type DiplomaCreationFormState = DiplomaCreationFormSchema & {
  modulesListDetails?: DynamicTagsItemList;
};

export type DiplomaInputItem = FetchingInputItem<DiplomaCreationFormSchema>;

export const diplomaCreationSchema = diplomaSchema(fieldData);
