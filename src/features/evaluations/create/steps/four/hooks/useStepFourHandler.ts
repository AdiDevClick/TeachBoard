import type { DynamicTagsItemList } from "@/components/Tags/types/tags.types";
import { debugLogs } from "@/configs/app-components.config";
import { DEV_MODE, NO_CACHE_LOGS } from "@/configs/app.config";
import { useStepFourState } from "@/features/evaluations/create/hooks/useStepFourState";
import type { UseStepFourHandlerProps } from "@/features/evaluations/create/steps/four/hooks/types/use-step-four-handler.types";
import type { GlobalWithInvalidSubmit } from "@/hooks/database/types/use-command-handler.types";
import { useEffect, useEffectEvent, useMemo } from "react";
import { useWatch, type FieldErrors, type FieldValues } from "react-hook-form";

/**
 * Custom hook to handle the logic for Step Four of the evaluation creation process, which includes managing the state of scores, evaluated students, and form submission.
 *
 * @param form - The react-hook-form instance used for managing the form state and validation in Step Four of the evaluation creation process.
 * @param pageId - The ID of the page, used for debugging and logging purposes.
 */
export function useStepFourHandler({ form, pageId }: UseStepFourHandlerProps) {
  const {
    scoreValue,
    nonPresentStudents,
    allStudentsAverageScores,
    modules,
    getEvaluatedStudentsForSubSkill,
    getAllPresentStudents,
    selectedClass,
  } = useStepFourState();

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

  const handleSubmit = (data: FieldValues) => {
    if (DEV_MODE) {
      console.debug(pageId + " form submitted with data:", data);
    }
  };

  /**
   * Handle Form submission when there are validation errors
   *
   * @param errors - The validation errors
   */
  const handleInvalidSubmit = <T extends FieldValues>(
    errors: FieldErrors<T>,
  ) => {
    if (DEV_MODE) {
      const currentValues = form.getValues();

      (
        globalThis as GlobalWithInvalidSubmit<T>
      ).__TB_CLASS_CREATION_LAST_INVALID_SUBMIT__ = {
        at: Date.now(),
        keys: Object.keys(errors ?? {}),
        values: {
          ...currentValues,
        },
      };

      if (!NO_CACHE_LOGS) {
        console.debug(pageId + " invalid submit", errors);
      }
    }
  };

  return {
    scoreValue,
    allStudentsAverageScores,
    modules,
    getEvaluatedStudentsForSubSkill,
    handleSubmit,
    handleInvalidSubmit,
    presenceMemo,
  };
}
