import z from "zod";

const dataField = {
  studentValidUuidMessage: "L'identifiant de l'élève doit être un UUID valide.",
  studentsNotEmptyMessage: "La liste des étudiants ne peut pas être vide.",
  studentsMaxMessage:
    "La liste des étudiants ne peut pas dépasser 50 éléments.",
  studentsMinLength: 1,
  studentsMaxLength: 50,
};

const studentsSchema = (data: typeof dataField) =>
  z.object({
    students: z
      .array(z.uuid(data.studentValidUuidMessage))
      .nonempty(data.studentsNotEmptyMessage)
      .min(data.studentsMinLength, data.studentsNotEmptyMessage)
      .max(data.studentsMaxLength, data.studentsMaxMessage)
      .nonoptional()
      .describe("Identifiant unique pour l'étudiant"),
  });

export type SearchStudentsFormSchema = z.infer<typeof searchStudentsSchema>;

export const searchStudentsSchema = studentsSchema(dataField);
