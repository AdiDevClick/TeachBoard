import z from "zod";

const dataErrors = {
  id: "Invalid evaluation ID",
  classId: "Invalid class ID",
  userId: "Invalid user ID",
  title: "Invalid title",
  comments: "Invalid comments",
  className: "Invalid class name",
  date: "Invalid date format",
  absentStudents: "Invalid absent students name",
  moduleName: "Invalid module name",
  moduleCode: "Invalid module code",
  subSkillId: "Invalid sub-skill ID",
  subSkillName: "Invalid sub-skill name",
  subSkillCode: "Invalid sub-skill code",
  subSkillIsDisabled: "Invalid sub-skill isDisabled value",
};

const schema = (data: typeof dataErrors) =>
  z.object({
    id: z.uuid(data.id),
    title: z.string(data.title),
    comments: z.string(data.comments).optional(),
    classId: z.uuid(data.classId),
    className: z.string(data.className).optional(),
    evaluationDate: z.iso.datetime(data.date),
    userId: z.uuid(data.userId),
    absentStudents: z.array(
      z.object({
        id: z.uuid(data.userId),
        name: z.string(data.absentStudents),
      }),
    ),
    attendedModules: z
      .array(
        z.object({
          id: z.uuid(data.classId),
          name: z.string(data.moduleName),
          code: z.string(data.moduleCode),
          subSkills: z.array(
            z.object({
              id: z.uuid(data.subSkillId),
              name: z.string(data.subSkillName),
              code: z.string(data.subSkillCode),
              isDisabled: z.boolean(data.subSkillIsDisabled),
            }),
          ),
        }),
      )
      .optional(),
    evaluations: z.array(
      z.object({
        id: z.uuid(data.id),
        name: z.string(data.title),
        isPresent: z.boolean(),
        overallScore: z.number().min(0).max(20).gt(0).nullable(),
        assignedTask: z.object({
          id: z.uuid(data.id),
          name: z.string(data.title),
        }),
        modules: z.array(
          z.object({
            id: z.uuid(data.classId),
            subSkills: z.array(
              z.object({
                id: z.uuid(data.subSkillId),
                score: z.number().min(0).max(100).gt(0),
              }),
            ),
          }),
        ),
      }),
    ),
  });

export type DetailedEvaluationView = z.infer<typeof detailedEvaluationSchema>;

export const detailedEvaluationSchema = schema(dataErrors);
