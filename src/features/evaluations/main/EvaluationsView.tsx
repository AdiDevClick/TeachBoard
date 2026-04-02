import { DynamicTags } from "@/components/Tags/DynamicTags";
import { LabelledTextArea } from "@/components/TextAreas/LabelledTextArea";
import { API_ENDPOINTS } from "@/configs/api.endpoints.config";
import { LabelledAccordion } from "@/features/evaluations/create/components/Accordion/LabelledAccordion";
import { AverageFields } from "@/features/evaluations/create/components/Score/AverageFields";
import { STEP_FOUR_INPUT_CONTROLLERS } from "@/features/evaluations/create/steps/four/config/step-four.configs";
import { useEvaluationsView } from "@/features/evaluations/main/hooks/useEvaluationsView";
import type { EvaluationsViewProps } from "@/features/evaluations/main/types/evaluations.types";
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

/**
 * EvaluationsView component that displays the details of an evaluation, including modules, student scores, and comments.
 *
 * @param apiEndpoint - Optional function to generate the API endpoint for fetching evaluation data by ID.
 * @param dataReshapeFn - Optional function to reshape the fetched evaluation data.
 * @param pageId - Optional ID for the page.
 * @param controllers - Optional input controllers for the step four inputs.
 */
export function EvaluationsView({
  apiEndpoint = API_ENDPOINTS.GET.EVALUATIONS.endpoints.BY_ID,
  dataReshapeFn = API_ENDPOINTS.GET.EVALUATIONS.dataReshape,
  pageId = "evaluation-overview",
  controllers = STEP_FOUR_INPUT_CONTROLLERS,
}: EvaluationsViewProps) {
  const {
    evaluationData,
    modules,
    getPresentStudentsWithAssignedTasks,
    studentsAverageScores,
    scoreValue,
    presence,
  } = useEvaluationsView({
    pageId,
    apiEndpoint,
    dataReshapeFn,
  });
  return (
    <div>
      <h1>{evaluationData?.title}</h1>
      <LabelledAccordion
        inputController={controllers.modules}
        accordionItems={modules}
        storeGetter={getPresentStudentsWithAssignedTasks}
        valueGetter={scoreValue}
      />
      <AverageFields
        form={null!}
        students={studentsAverageScores}
        {...controllers.scoresAverage}
        viewMode={true}
      />
      <DynamicTags
        {...controllers.absence}
        itemList={presence.students}
        displayCRUD={false}
        disableAnimation
      />
      <LabelledTextArea
        {...controllers.comments}
        defaultValue={evaluationData?.comments ?? ""}
        readOnly
      />
    </div>
  );
}
