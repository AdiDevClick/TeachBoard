import type { ClassSummaryDto } from "@/api/types/routes/classes.types";
import { DynamicTags } from "@/components/Tags/DynamicTags";
import type { DynamicTagsItemList } from "@/components/Tags/types/tags.types";
import { LabelledTextArea } from "@/components/TextAreas/LabelledTextArea";
import { API_ENDPOINTS } from "@/configs/api.endpoints.config";
import type { AppModalNames } from "@/configs/app.config";
import { LabelledAccordion } from "@/features/evaluations/create/components/Accordion/LabelledAccordion";
import { AverageFields } from "@/features/evaluations/create/components/Score/AverageFields";
import { useStepFourState } from "@/features/evaluations/create/hooks/useStepFourState";
import { STEP_FOUR_INPUT_CONTROLLERS } from "@/features/evaluations/create/steps/four/config/step-four.configs";
import type { StepFourInputControllers } from "@/features/evaluations/create/steps/four/controller/types/step-four-controller.types";
import { useEvaluationStepsCreationStore } from "@/features/evaluations/create/store/EvaluationStepsCreationStore";
import type { EvaluationRehydrationPayload } from "@/features/evaluations/create/store/types/steps-creation-store.types";
import { useCommandHandler } from "@/hooks/database/classes/useCommandHandler";
import { parseToUuid } from "@/utils/utils";
import { useEffect, useEffectEvent, useMemo } from "react";
import { useParams } from "react-router-dom";

function reshapeEvaluationDetails(data: EvaluationRehydrationPayload) {
  return data;
}

function reshapeClassSummary(data: ClassSummaryDto) {
  return data;
}

export function EvaluationsView({
  apiEndpoint = API_ENDPOINTS.GET.EVALUATIONS.endpoints.BY_ID,
  task = "evaluation-overview",
  dataReshapeFn = API_ENDPOINTS.GET.EVALUATIONS.dataReshape,
  controllers = STEP_FOUR_INPUT_CONTROLLERS,
}: Readonly<{
  apiEndpoint?: (id: string) => string;
  task?: AppModalNames;
  dataReshapeFn?: (data: unknown) => unknown;
  controllers?: StepFourInputControllers;
}>) {
  const { evaluationId } = useParams();
  const parsedEvaluationId = parseToUuid(evaluationId);

  const {
    openingCallback: fetchEvaluationOpeningCallback,
    data: evaluationData,
  } = useCommandHandler({
    pageId: "evaluation-overview",
    form: null!,
    submitDataReshapeFn: reshapeEvaluationDetails,
  });

  const { openingCallback: fetchClassOpeningCallback, data: classData } =
    useCommandHandler({
      pageId: "evaluation-class-selection",
      form: null!,
      submitDataReshapeFn: reshapeClassSummary,
    });

  const endPoint = apiEndpoint(parsedEvaluationId);

  const {
    scoreValue,
    nonPresentStudents,
    allStudentsAverageScores,
    modules,
    getEvaluatedStudentsForSubSkill,
  } = useStepFourState();

  const fetchEvaluation = useEffectEvent(() => {
    fetchEvaluationOpeningCallback(true, {
      apiEndpoint: endPoint,
      dataReshapeFn,
      task,
    });
  });

  const fetchClassDetails = useEffectEvent((classId: string) => {
    fetchClassOpeningCallback(true, {
      apiEndpoint: API_ENDPOINTS.GET.CLASSES.endPoints.BY_ID(classId),
      dataReshapeFn: reshapeClassSummary,
      task: "evaluation-class-selection",
    });
  });

  /**
   * Initial fetch for evaluation details.
   */
  useEffect(() => {
    fetchEvaluation();
  }, [endPoint]);

  /**
   * Once evaluation details are loaded, fetch class details required for store hydration.
   */
  useEffect(() => {
    const classId = evaluationData?.classId;

    if (!classId) {
      return;
    }

    if (classData?.id === classId) {
      return;
    }

    fetchClassDetails(classId);
  }, [evaluationData?.classId, classData?.id]);

  /**
   * Fill the evaluation creation store from loaded evaluation and class payloads.
   */
  useEffect(() => {
    if (!evaluationData || !classData) {
      return;
    }

    if (classData.id !== evaluationData.classId) {
      return;
    }

    useEvaluationStepsCreationStore
      .getState()
      .rehydrateFromEvaluationPayload(classData, evaluationData);
  }, [evaluationData, classData]);

  /**
   * Generates a list of absent students names to display.
   */
  const presenceMemo = useMemo<{
    students: DynamicTagsItemList;
    ids: string[];
  }>(() => {
    const studentsPresence = Array.from(nonPresentStudents?.values() ?? []);
    const studentsIds = Array.from(nonPresentStudents?.keys() ?? []);

    if (studentsPresence.length === 0) {
      return {
        students: [["Aucun", { id: "none" }]],
        ids: ["none"],
      };
    }

    return { students: studentsPresence, ids: studentsIds };
  }, [nonPresentStudents]);

  return (
    <div>
      <h1>{evaluationData?.title}</h1>
      <p>Evaluation ID: {parsedEvaluationId}</p>
      <LabelledAccordion
        inputController={controllers.modules}
        accordionItems={modules}
        storeGetter={getEvaluatedStudentsForSubSkill}
        valueGetter={scoreValue}
      />
      <AverageFields
        form={null!}
        students={allStudentsAverageScores}
        {...controllers.scoresAverage}
      />
      <DynamicTags
        {...controllers.absence}
        itemList={presenceMemo.students}
        displayCRUD={false}
      />
      <LabelledTextArea
        {...controllers.comments}
        defaultValue={evaluationData?.comments ?? ""}
        readOnly
      />
    </div>
  );
}
