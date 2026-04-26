import type { UUID } from "@/api/types/openapi/common.types";
import type { DynamicTagsItemList } from "@/components/Tags/types/tags.types";
import { API_ENDPOINTS } from "@/configs/api.endpoints.config";
import { useStepFourState } from "@/features/evaluations/create/hooks/useStepFourState";
import type { UseStepFourHandlerProps } from "@/features/evaluations/create/steps/four/hooks/types/use-step-four-handler.types";
import {
  type StepFourFormSchema,
  stepFourInputSchema,
} from "@/features/evaluations/create/steps/four/models/step-four.models";
import { useEvaluationTableStore } from "@/features/evaluations/main/configs/evaluations.configs";
import { useCommandHandler } from "@/hooks/database/classes/useCommandHandler";
import { saveObjectInCache } from "@/hooks/database/fetches/functions/use-fetch.functions";
import type { AnyObjectProps } from "@/utils/types/types.utils";
import { parseFromObject } from "@/utils/utils";
import { useEffect, useEffectEvent, useMemo } from "react";
import { useLoaderData, useNavigate } from "react-router-dom";

/**
 * Custom hook to handle the logic for Step Four of the evaluation creation process, which includes managing the state of scores, evaluated students, and form submission.
 *
 * @param form - The react-hook-form instance used for managing the form state and validation in Step Four of the evaluation creation process.
 * @param pageId - The ID of the page, used for debugging and logging purposes.
 */
export function useStepFourHandler({
  pageId,
  form,
  submitRoute,
  submitDataReshapeFn,
}: UseStepFourHandlerProps) {
  const {
    scoreValue,
    nonPresentStudents,
    allStudentsAverageScores,
    modules,
    getEvaluatedStudentsForSubSkill,
    getAllPresentStudents,
    selectedClass,
    clear,
  } = useStepFourState();

  const { submitCallback, invalidSubmitCallback, queryClient, response } =
    useCommandHandler({
      pageId,
      form,
      submitRoute,
      submitDataReshapeFn,
    });

  const { setValue } = form;
  const navigate = useNavigate();
  const { mode } = useLoaderData();

  /**
   * Generates a list of absent students names to display
   *
   * @description Saves ids instead of names in the form for validation.
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

  /**
   * Handle Step Four form submission when form is valid
   *
   * @param variables - The form data to submit
   */
  const handleValidSubmit = (variables: StepFourFormSchema) => {
    const parsedVariables = stepFourInputSchema.parse(variables);

    const hasNone = parsedVariables.absence.includes("none");

    if (hasNone) {
      parsedVariables.absence = [];
    }

    delete parsedVariables["overallScore"];

    const isEditMode = mode === "edit";
    const customSuccessMessage = isEditMode
      ? "Évaluation mise à jour avec succès !"
      : "Évaluation créée avec succès !";

    const loadingMessage = isEditMode
      ? "Mise à jour de l'évaluation en cours..."
      : "Création de l'évaluation en cours...";

    submitCallback(parsedVariables, {
      abortController: new AbortController(),
      method: isEditMode ? "PUT" : "POST",
      toastOptions: {
        loadingMessage,
      },
      successDescription() {
        return {
          type: "success",
          customSuccessMessage,
        };
      },
    });
  };

  /**
   * INIT - Saving the class id in the form state for validation
   */
  const saveBasicDataToForm = useEffectEvent(
    (classId?: string, items?: typeof presenceMemo) => {
      if (classId) {
        const noAbsentStudents = items?.ids.length === 0;
        const ids = noAbsentStudents ? ["none"] : items?.ids;

        const parsed = parseFromObject(
          getAllPresentStudents,
        ) as unknown as StepFourFormSchema["evaluations"];

        setValue("evaluations", parsed ?? []);
        setValue("absence", ids!);
        setValue("classId", classId);
        setValue("attendedModules", modules);
      }
    },
  );

  /**
   * INIT -
   *
   * @description (Unlikely to trigger more than once) - Each time a student is marked as non-present
   */
  useEffect(() => {
    saveBasicDataToForm(selectedClass?.id, presenceMemo);
  }, [presenceMemo, selectedClass?.id]);

  /**
   * RESULTS - Clear & navigate
   */
  const clearAndNavigate = useEffectEvent(
    (evalId: UUID, parsedResponse: AnyObjectProps) => {
      saveObjectInCache(
        queryClient,
        [
          "evaluation-overview",
          API_ENDPOINTS.GET.EVALUATIONS.endpoints.BY_ID(evalId),
        ],
        parsedResponse,
      );

      clear(selectedClass?.id as UUID, true);
      navigate(`/evaluations/${evalId}`);
    },
  );

  /**
   * RESULTS - Show toasts on loading, success and error states
   */
  useEffect(() => {
    if (response) {
      const store = useEvaluationTableStore.getState();
      const parsedResponse = parseFromObject(response.data);
      const evalId = parsedResponse?.id as UUID;

      if (parsedResponse) {
        const itemInStore = store.hasItem(evalId);
        if (!itemInStore) {
          // Save in local persisted store to avoid fetching
          store.addItemToTop(parsedResponse as never);
        }

        if (itemInStore) {
          // Refresh IDB data
          store.updateItem(evalId, parsedResponse as never);
        }

        // While we have access to the data, cache it in case the user navigates to the evaluation overview, to avoid a fetch there.
        clearAndNavigate(evalId, parsedResponse);
      }
    }
  }, [response]);

  return {
    scoreValue,
    allStudentsAverageScores,
    modules,
    getEvaluatedStudentsForSubSkill,
    presenceMemo,
    handleValidSubmit,
    invalidSubmitCallback,
  };
}
