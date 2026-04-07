import z from "zod";

export const detailedEvaluationSchema = z.object({
  id: z.uuid(),
  title: z.string(),
  comments: z.string().optional(),
  classId: z.uuid(),
  className: z.string().optional(),
  evaluationDate: z.iso.datetime(),
  userId: z.uuid(),
  absentStudents: z.array(z.object({ id: z.uuid(), name: z.string() })),
  attendedModules: z
    .array(
      z.object({
        id: z.uuid(),
        name: z.string(),
        code: z.string(),
        subSkills: z.array(
          z.object({
            id: z.uuid(),
            name: z.string(),
            code: z.string(),
            isDisabled: z.boolean(),
          }),
        ),
      }),
    )
    .optional(),
  evaluations: z.array(
    z.object({
      id: z.uuid(),
      name: z.string(),
      isPresent: z.boolean(),
      overallScore: z.number().min(0).max(20).gt(0).nullable(),
      assignedTask: z.object({
        id: z.uuid(),
        name: z.string(),
      }),
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
