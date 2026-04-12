import type { UUID } from "@/api/types/openapi/common.types";
import type { DynamicTagsItemList } from "@/components/Tags/types/tags.types";
import { API_ENDPOINTS } from "@/configs/api.endpoints.config";
import { debugLogs } from "@/configs/app-components.config";
import { useStepFourState } from "@/features/evaluations/create/hooks/useStepFourState";
import type { UseStepFourHandlerProps } from "@/features/evaluations/create/steps/four/hooks/types/use-step-four-handler.types";
import {
  type StepFourFormSchema,
  stepFourInputSchema,
} from "@/features/evaluations/create/steps/four/models/step-four.models";
import { useEvaluationStepsCreationStore } from "@/features/evaluations/create/store/EvaluationStepsCreationStore";
import { useEvaluationTableStore } from "@/features/evaluations/main/configs/evaluations.configs";
import { useCommandHandler } from "@/hooks/database/classes/useCommandHandler";
import { saveObjectInCache } from "@/hooks/database/fetches/functions/use-fetch.functions";
import { parseFromObject } from "@/utils/utils";
import { useEffect, useEffectEvent, useMemo } from "react";
import { useWatch } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const toastId = "step-four-submit-toast";
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
    title: titleFromStore,
    comments: commentsFromStore,
  } = useStepFourState();

  const {
    submitCallback,
    invalidSubmitCallback,
    queryClient,
    isLoading,
    error,
    response,
  } = useCommandHandler({
    pageId,
    form,
    submitRoute,
    submitDataReshapeFn,
  });

  const { setValue, reset, control } = form;
  const navigate = useNavigate();

  // Existing watch for overallScore
  const overallScoreWatch = useWatch({
    control,
    name: "overallScore",
  });

  useWatch({
    control,
    name: "title",
    compute: (title) => {
      if (
        (titleFromStore && title !== titleFromStore) ||
        (!titleFromStore && title)
      ) {
        useEvaluationStepsCreationStore.setState({ title });
      }
    },
  });

  useWatch({
    control,
    name: "comments",
    compute: (comments) => {
      if (
        (commentsFromStore && comments !== commentsFromStore) ||
        (!commentsFromStore && comments)
      ) {
        useEvaluationStepsCreationStore.setState({ comments });
      }
    },
  });

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

    delete parsedVariables["overallScore"];
    submitCallback(parsedVariables, {
      abortController: new AbortController(),
      method: "POST",
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
   * SCORE UPDATES - UPDATE EVALUATIONS IN THE FORM
   *
   * @description This is needed to sync the form state with the (default) calculated score -
   *
   * @remark If a overall score is manually entered, this will always be the source of truth for the form value, and will become the default value shown in the input.
   *
   * @remark The submit to the server may never recalculate the score, but all subskills and module states will be passed on with their own score
   */
  const triggerScoreUpdate = useEffectEvent(() => {
    try {
      const stringified = JSON.stringify(getAllPresentStudents);
      const parsed = JSON.parse(stringified);

      setValue("evaluations", parsed);
    } catch (error) {
      debugLogs("StepFourController:triggerScoreUpdate", {
        type: "componentHandler",
        error,
        message: "Failed to parse evaluated students for form submission",
      });
      setValue("evaluations", []);
    }
  });

  /**
   * SCORE UPDATES -
   *
   * @description Each time the overall score changes
   */
  useEffect(() => {
    triggerScoreUpdate();
  }, [overallScoreWatch]);

  /**
   * RESULTS - Show toasts on loading, success and error states
   */
  useEffect(() => {
    if (isLoading && !toast.getToasts().some((t) => t.id === toastId)) {
      toast.dismiss();
      toast.loading("Envoi en cours...", {
        id: toastId,
      });
    }
    if (error || response) {
      toast.dismiss(toastId);

      if (error) {
        reset(undefined, {
          keepValues: true,
          keepErrors: true,
          keepDirty: true,
          keepTouched: true,
          keepIsSubmitted: false,
        });
      }

      if (response) {
        toast.success("Évaluation créée avec succès !", {
          id: toastId,
        });
        const store = useEvaluationTableStore.getState();
        const parsedResponse = parseFromObject(response.data);

        if (parsedResponse && !store.hasItem(parsedResponse.id as UUID)) {
          // Save in local persisted store to avoid fetching
          store.addItemToTop(parsedResponse as never);

          // While we have access to the data, cache it in case the user navigates to the evaluation overview, to avoid a fetch there.
          saveObjectInCache(
            queryClient,
            [
              "evaluation-overview",
              API_ENDPOINTS.GET.EVALUATIONS.endpoints.BY_ID(
                parsedResponse.id as UUID,
              ),
            ],
            parsedResponse,
          );
        }

        clear(selectedClass?.id as UUID, true);
        navigate("/evaluations");
      }
    }
  }, [isLoading, error, response]);

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
