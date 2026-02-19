import type { DynamicTagsItemList } from "@/components/Tags/types/tags.types";
import { debugLogs } from "@/configs/app-components.config";
import { DEV_MODE } from "@/configs/app.config";
import { useStepFourState } from "@/features/evaluations/create/hooks/useStepFourState";
import type { UseStepFourHandlerProps } from "@/features/evaluations/create/steps/four/hooks/types/use-step-four-handler.types";
import {
  type StepFourFormSchema,
  stepFourInputSchema,
} from "@/features/evaluations/create/steps/four/models/step-four.models";
import { useCommandHandler } from "@/hooks/database/classes/useCommandHandler";
import { useEffect, useEffectEvent, useMemo } from "react";
import { useWatch } from "react-hook-form";
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
  } = useStepFourState();

  const { submitCallback, invalidSubmitCallback, isLoading, error, response } =
    useCommandHandler({
      pageId,
      form,
      submitRoute,
      submitDataReshapeFn,
    });

  // Existing watch for overallScore
  const overallScoreWatch = useWatch({
    control: form.control,
    name: "overallScore",
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

        form.setValue("absence", ids!);
        form.setValue("classId", classId);
        form.setValue("attendedModules", modules);
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
      const parsed = JSON.parse(JSON.stringify(getAllPresentStudents));
      form.setValue("evaluations", parsed);
    } catch (error) {
      if (DEV_MODE) {
        debugLogs(
          "StepFourController — invalid evaluations parsing from store:",
          error,
        );
      }
      form.setValue("evaluations", []);
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
      // If there's an error, show an error toast
      if (error?.status === 400 || error?.status === 401) {
        toast.error(
          "Identifiant ou mot de passe incorrect. Veuillez vérifier vos informations et réessayer.",
        );
      }
    }

    if (response) {
      toast.success("Évaluation créée avec succès !", {
        id: toastId,
      });
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
