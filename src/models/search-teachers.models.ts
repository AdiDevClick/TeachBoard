import z from "zod";

const dataField = {
  teacherValidUuidMessage:
    "L'identifiant du professeur doit être un UUID valide.",
  teachersNotEmptyMessage: "La liste des professeurs ne peut pas être vide.",
  teachersMaxMessage:
    "La liste des professeurs ne peut pas dépasser 2 éléments.",
  teachersMinLength: 1,
  teachersMaxLength: 2,
};

const searchTeachersModel = (data: typeof dataField) =>
  z.object({
    teacher: z
      .array(z.uuid(data.teacherValidUuidMessage))
      .nonempty(data.teachersNotEmptyMessage)
      .min(data.teachersMinLength, data.teachersNotEmptyMessage)
      .max(data.teachersMaxLength, data.teachersMaxMessage)
      .nonoptional()
      .describe("Identifiant unique pour le professeur"),
  });

export type SearchTeachersFormSchema = z.infer<typeof searchTeachersSchema>;

export const searchTeachersSchema = searchTeachersModel(dataField);
