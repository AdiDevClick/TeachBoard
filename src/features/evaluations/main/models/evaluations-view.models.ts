import z from "zod";

export const detailedEvaluationSchema = z.object({
  id: z.uuid(),
  title: z.string(),
  comments: z.string().optional(),
  classId: z.uuid(),
  className: z.string().optional(),
  evaluationDate: z.iso.datetime(),
  userId: z.uuid(),
  absencesIds: z.array(z.uuid()),
  attendedModules: z
    .array(
      z.object({
        id: z.uuid(),
        name: z.string(),
        code: z.string(),
      }),
    )
    .optional(),
  evaluations: z.array(
    z.object({
      studentId: z.uuid(),
      isPresent: z.boolean(),
      overallScore: z.number().min(0).max(20).gt(0).nullable(),
      assignedTaskId: z.uuid(),
      modules: z.array(
        z.object({
          id: z.uuid(),
          subSkills: z.array(
            z.object({
              id: z.uuid(),
              score: z.number().min(0).max(100).gt(0),
            }),
          ),
        }),
      ),
    }),
  ),
});

export type DetailedEvaluationView = z.infer<typeof detailedEvaluationSchema>;
