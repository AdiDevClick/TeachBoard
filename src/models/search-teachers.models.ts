import z from "zod";

const dataField = {
  primaryTeacherValidUuidMessage:
    "L'identifiant du professeur principal doit être un UUID valide.",
  primaryTeachersNotEmptyMessage:
    "L'identifiant du professeur principal ne peut pas être vide.",
};

const searchPrimaryTeacherModel = (data: typeof dataField) =>
  z.object({
    primaryTeacherId: z
      .uuid(data.primaryTeacherValidUuidMessage)
      .nonempty(data.primaryTeachersNotEmptyMessage)
      .nonoptional()
      .describe("Identifiant unique pour le professeur"),
  });

export type SearchPrimaryTeacherFormSchema = z.infer<
  typeof SearchPrimaryTeacherSchema
>;

export const SearchPrimaryTeacherSchema =
  searchPrimaryTeacherModel(dataField);
