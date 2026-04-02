import type { DynamicTagsItemList } from "@/components/Tags/types/tags.types";
import { API_ENDPOINTS } from "@/configs/api.endpoints.config";
import { useEvaluationStepsCreationStore } from "@/features/evaluations/create/store/EvaluationStepsCreationStore";
import type { EvaluationRehydrationPayload } from "@/features/evaluations/create/store/types/steps-creation-store.types";
import {
  selectClassFromStore,
  selectClassMetas,
  studentPresence,
} from "@/features/evaluations/main/functions/evaluations-view.functions";
import type { UseEvaluationsViewProps } from "@/features/evaluations/main/hooks/types/use-evaluations-view.types";
import { useCommandHandler } from "@/hooks/database/classes/useCommandHandler";
import type { ApiSuccess } from "@/types/AppResponseInterface";
import { parseToUuid } from "@/utils/utils";
import { useEffect, useEffectEvent, useMemo, useRef } from "react";
import { useParams } from "react-router-dom";
import { useShallow } from "zustand/shallow";

const classTask = "evaluation-class-selection";

/**
 * Hook containing the logic for the EvaluationsView component
 *
 * @description Responsible for fetching and processing evaluation data based on the ID from the URL
 */
export function useEvaluationsView({
  pageId = "evaluation-overview",
  apiEndpoint = API_ENDPOINTS.GET.EVALUATIONS.endpoints.BY_ID,
  dataReshapeFn = API_ENDPOINTS.GET.EVALUATIONS.dataReshape,
}: UseEvaluationsViewProps) {
  const { evaluationId } = useParams();
  const parsedEvaluationId = parseToUuid(evaluationId);
  const lastHydrationKeyRef = useRef<string>("");

  const {
    openingCallback: fetchEvaluationCallback,
    resultsCallback: evaluationCacheCallback,
  } = useCommandHandler<
    Record<string, never>,
    never,
    never,
    ApiSuccess<EvaluationRehydrationPayload>
  >({
    pageId,
    form: null!,
  });

  const {
    openingCallback: fetchClassCallback,
    resultsCallback: classCacheCallback,
  } = useCommandHandler({
    pageId: classTask,
    form: null!,
  });

  const modules = useEvaluationStepsCreationStore(
    useShallow((state) => state.getAttendedModules()),
  );

  const {
    nonPresentStudentsResult: nonPresentStudents,
    getAllStudentsAverageScores,
    getPresentStudentsWithAssignedTasks,
    getStudentScoreForSubSkill: scoreValue,
    selectedClass: selectedClassFromStore,
  } = useEvaluationStepsCreationStore();

  const endPoint = parsedEvaluationId
    ? apiEndpoint(parsedEvaluationId)
    : undefined;

  const evaluationData =
    evaluationCacheCallback<EvaluationRehydrationPayload>();
  const classData = classCacheCallback();

  /**
   * Memoized selected class data for display and store hydration, derived from the fetched class data.
   */
  const selectedClassDatasMemo = useMemo(() => {
    if (!classData) {
      return null;
    }

    return selectClassMetas(classData);
  }, [classData]);

  /**
   * Memoized selected class for hydration, derived from either the fetched class data or the store
   */
  const selectedClassForHydration = useMemo(() => {
    if (selectedClassDatasMemo?.selectedClass) {
      return selectedClassDatasMemo.selectedClass;
    }

    return selectClassFromStore(
      selectedClassFromStore,
      evaluationData?.classId,
    );
  }, [evaluationData, selectedClassDatasMemo, selectedClassFromStore]);

  /**
   * Fetch evaluation -
   *
   * @description Triggers setFetchParams
   */
  const fetchEvaluation = useEffectEvent((endpoint: string) => {
    fetchEvaluationCallback(true, {
      apiEndpoint: endpoint,
      dataReshapeFn,
      task: pageId,
    });
  });

  /**
   * Fetch evaluation -
   *
   * @description On component mount or when evaluationId changes.
   */
  useEffect(() => {
    if (!endPoint) {
      return;
    }

    fetchEvaluation(endPoint);
  }, [endPoint]);

  /**
   * Fetch Class details -
   *
   * @description Triggers setFetchParams
   */
  const fetchClassDetails = useEffectEvent((classId: string) => {
    fetchClassCallback(true, {
      apiEndpoint: API_ENDPOINTS.GET.CLASSES.endPoints.BY_ID(classId),
      dataReshapeFn: API_ENDPOINTS.GET.CLASSES.dataReshape,
      task: classTask,
    });
  });

  /**
   * Fetch Class details -
   *
   * @description Once evaluation details are fetched
   */
  useEffect(() => {
    const classId = evaluationData?.classId;
    const matchedStoreClassId = selectedClassFromStore?.id;

    if (
      !classId ||
      selectedClassDatasMemo?.id === classId ||
      matchedStoreClassId === classId
    ) {
      return;
    }

    fetchClassDetails(classId);
  }, [
    evaluationData?.classId,
    selectedClassDatasMemo?.id,
    selectedClassFromStore,
  ]);

  /**
   * Rehydrate the evaluation creation store with the fetched evaluation details.
   */
  useEffect(() => {
    if (!evaluationData || !selectedClassForHydration) {
      return;
    }

    const hydrationKey = `${evaluationData.id}:${selectedClassForHydration.id}`;

    if (lastHydrationKeyRef.current === hydrationKey) {
      return;
    }

    const isHydrated = useEvaluationStepsCreationStore
      .getState()
      .rehydrateFromEvaluationPayload(
        selectedClassForHydration,
        evaluationData,
      );

    if (isHydrated) {
      lastHydrationKeyRef.current = hydrationKey;
    }
  }, [evaluationData, selectedClassForHydration]);

  /**
   * Generates a list of absent students names to display.
   */
  const presenceMemo = useMemo<{
    students: DynamicTagsItemList;
  }>(() => {
    if (!evaluationData) {
      return {
        students: [],
      };
    }

    return studentPresence(nonPresentStudents, evaluationData);
  }, [evaluationData, nonPresentStudents]);

  const studentsAverageScores = Array.from(
    getAllStudentsAverageScores().entries(),
  );

  return {
    scoreValue,
    studentsAverageScores,
    modules,
    getPresentStudentsWithAssignedTasks,
    presenceMemo,
    evaluationData,
  };
}
