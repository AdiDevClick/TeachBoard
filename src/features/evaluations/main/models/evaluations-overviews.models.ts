import z from "zod";

const schemaData = {
  idError: "Le format de l'id de l'évaluation est invalide",
  titleError: "Un titre est requis et doit être une chaîne de caractères",
  classIdError: "Le format de l'id de classe est invalide",
  evaluationDateError: "La date d'évaluation doit être au format ISO",
  userIdError: "Le format de l'id de l'utilisateur est invalide",
  createdAtError: "La date de création doit être au format ISO",
  updatedAtError: "La date de mise à jour doit être au format ISO",
};

const schema = (data: typeof schemaData) =>
  z.array(
    z.object({
      id: z
        .uuid(data.idError)
        .meta({ description: "Unique identifier for the evaluation" }),
      title: z.string().min(2).meta({ description: "Title of the evaluation" }),
      classId: z
        .uuid(data.classIdError)
        .meta({ description: "Unique identifier for the class" }),
      className: z
        .string()
        .optional()
        .meta({ description: "Name of the class" }),
      evaluationDate: z.iso
        .datetime(data.evaluationDateError)
        .meta({ description: "Date of the evaluation in ISO format" }),
      userId: z
        .uuid(data.userIdError)
        .meta({ description: "Unique identifier for the user" }),
      createdAt: z.iso
        .datetime(data.createdAtError)
        .meta({ description: "Date of creation in ISO format" }),
      updatedAt: z.iso
        .datetime(data.updatedAtError)
        .optional()
        .meta({ description: "Date of update in ISO format" }),
    }),
  );

export type EvaluationOverview = z.infer<
  typeof evaluationOverviewsSchema
>[number];

export const evaluationOverviewsSchema = schema(schemaData);
