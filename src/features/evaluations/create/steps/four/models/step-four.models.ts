import type { FetchingInputItem } from "@/components/Inputs/types/inputs.types.ts";
import { formsRegex } from "@/configs/formsRegex.config";
import z from "zod";

const fieldData = {
  UUIDValidMessage: "L'identifiant doit être un UUID valide.",
  commentsInvalidCharsMessage:
    "Les commentaires contiennent des caractères invalides.",
  commentsMaxCharsMessage:
    "Les commentaires ne doivent pas dépasser 512 caractères.",
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
  subSkillScoreInvalidMinMessage:
    "La note de la sous-compétence ne peut être inférieure à 0.",
  subSkillScoreInvalidMaxMessage:
    "La note de la sous-compétence ne peut être supérieure à 100.",
};

const stepFourSchema = (data: typeof fieldData) =>
  z.object({
    userId: z
      .uuid(data.UUIDValidMessage)
      .nonempty(data.userIdRequiredMessage)
      .describe("Unique identifier for the user creating the evaluation"),
    classId: z
      .uuid(data.UUIDValidMessage)
      .nonempty(data.userIdRequiredMessage)
      .describe("Identifier for the class being evaluated"),
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
    comments: z
      .string()
      .trim()
      .regex(formsRegex.serverDescription, data.commentsInvalidCharsMessage)
      .max(500, data.commentsMaxCharsMessage)
      .optional()
      .describe("General comments for the evaluation"),
    absence: z
      .array(z.uuid(data.UUIDValidMessage))
      .nonempty(data.absenceInvalidMessage)
      .refine((value) => value[0] !== "none", data.absenceInvalidMessage)
      .describe("List of absent students during the evaluation"),
    overallScore: z
      .number(data.scoreAverageInvalidTypeMessage)
      .min(0, data.scoreAverageInvalidMinMessage)
      .max(20, data.scoreAverageInvalidMaxMessage)
      .describe(
        "Average score of the student - It can be overwritten by the teacher and will be saved as is",
      ),
    // }),
    // overallScore: z
    //   .array(
    //     z.object({
    //       studentId: z
    //         .uuid(data.UUIDValidMessage)
    //         .describe("Unique identifier for the student"),
    //       value: z
    //         .number(data.scoreAverageInvalidTypeMessage)
    //         .min(0, data.scoreAverageInvalidMinMessage)
    //         .max(20, data.scoreAverageInvalidMaxMessage)
    //         .describe(
    //           "Average score of the student - It can be overwritten by the teacher and will be saved as is",
    //         ),
    //     }),
    //   )
    // .describe("Average scores for each evaluated student"),
    evaluations: z.array(
      z.object({
        id: z.uuid(),
        isPresent: z.boolean(),
        overallScore: z.number().optional(),
        assignedTask: z
          .object({
            id: z.uuid(),
          })
          .nullable()
          .describe("Assigned task to the student during the evaluation"),
        evaluations: z.array(
          z
            .object({
              id: z.uuid(),
              name: z.string(),
              subSkills: z.array(
                z
                  .object({
                    id: z.uuid(),
                    score: z
                      .number()
                      .min(0, data.subSkillScoreInvalidMinMessage)
                      .max(100, data.subSkillScoreInvalidMaxMessage),
                  })
                  .describe(
                    "Sub-skill evaluations for the module - scores from 0 to 100, by steps of 25",
                  ),
              ),
            })
            .describe("Module evaluations for the student"),
        ),
      }),
    ),
  });

export type StepFourSchema = z.infer<typeof stepFourInputSchema>;

export type StepFourInputItem = FetchingInputItem<StepFourSchema>;

export const stepFourInputSchema = stepFourSchema(fieldData);
