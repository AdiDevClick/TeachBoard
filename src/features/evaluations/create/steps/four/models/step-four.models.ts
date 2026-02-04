import type { FetchingInputItem } from "@/components/Inputs/types/inputs.types.ts";
import { formsRegex } from "@/configs/formsRegex.config";
import { title } from "process";
import z from "zod";

const fieldData = {
  UUIDValidMessage: "L'identifiant doit être un UUID valide.",
  observationsInvalidCharsMessage:
    "Les observations contiennent des caractères invalides.",
  observationsMaxCharsMessage:
    "Les observations ne doivent pas dépasser 512 caractères.",
  absenceInvalidMessage:
    "Au moins un élève doit être sélectionné comme absent ou 'Aucun'.",
  scoreAverageInvalidMinMessage: "La note moyenne ne peut être inférieure à 0.",
  scoreAverageInvalidMaxMessage:
    "La note moyenne ne peut être supérieure à 20.",
  scoreAverageInvalidTypeMessage: "Veuiller saisir un nombre.",
  evaluatorIdRequiredMessage: "L'identifiant de l'évaluateur est requis.",
  userIdRequiredMessage: "L'identifiant de l'utilisateur est requis.",
  dateFormatInvalidMessage:
    "Le format de la date d'évaluation est invalide. Utilisez le format ISO.",
  titleRequiredMessage: "Le titre de l'évaluation est requis.",
  titleInvalidCharsMessage:
    "Le titre de l'évaluation contient des caractères invalides.",
};

const stepFourSchema = (data: typeof fieldData) =>
  z.object({
    userId: z
      .uuid(data.UUIDValidMessage)
      .nonempty(data.userIdRequiredMessage)
      .describe("Unique identifier for the user creating the evaluation"),
    evaluatorId: z
      .uuid(data.UUIDValidMessage)
      .nonempty(data.evaluatorIdRequiredMessage)
      .describe("Unique identifier for the evaluator"),
    evaluationDate: z
      .string()
      .refine(
        (value) => formsRegex.dateISOTest.test(value),
        data.dateFormatInvalidMessage,
      )
      .describe(
        "Server is using ISO format - Date of the evaluation must match",
      ),
    title: z
      .string()
      .regex(formsRegex.serverDescription, data.titleInvalidCharsMessage)
      .nonempty(data.titleRequiredMessage)
      .describe("Title of the evaluation"),
    observations: z
      .string()
      .max(512, data.observationsMaxCharsMessage)
      .regex(
        formsRegex.allowedCharDescriptionTest,
        data.observationsInvalidCharsMessage,
      )
      .trim()
      .optional()
      .describe("General observations for the evaluation"),
    absence: z
      .array(z.uuid(data.UUIDValidMessage))
      .nonempty(data.absenceInvalidMessage)
      .refine((value) => value[0] !== "none", data.absenceInvalidMessage)
      .describe("List of absent students during the evaluation"),
    scoresAverage: z
      .number(data.scoreAverageInvalidTypeMessage)
      .min(0, data.scoreAverageInvalidMinMessage)
      .max(20, data.scoreAverageInvalidMaxMessage)
      .describe("Average score of all evaluated students"),
    modules: z.array(
      z.object({
        id: z.string(),
        name: z.string(),
        subSkills: z.array(
          z.object({
            id: z.string(),
            name: z.string(),
            isCompleted: z.boolean(),
            isDisabled: z.boolean(),
          }),
        ),
      }),
    ),
  });

export type StepFourInputItem = FetchingInputItem<
  z.infer<typeof stepFourInputSchema>
>;

export const stepFourInputSchema = stepFourSchema(fieldData);
