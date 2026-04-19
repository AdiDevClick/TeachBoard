import { useStepFourState } from "@/features/evaluations/create/hooks/useStepFourState";
import { buildNewEvaluation } from "@/features/evaluations/create/steps/four/functions/step-four.functions";
import type { UseFormWatchersProps } from "@/features/evaluations/create/steps/four/hooks/types/use-form-watcher.types";
import { useEvaluationStepsCreationStore } from "@/features/evaluations/create/store/EvaluationStepsCreationStore";
import { useWatch } from "react-hook-form";

/**
 * Custom hook to set up watchers for the form fields in Step Four of the evaluation creation process.
 *
 * @description This only contains watchers related to form fields that require side effects or syncing with the store
 *
 * @param form - The react-hook-form instance used for managing the form state and validation in Step Four of the evaluation creation process.
 */
export function useFormWatchers({
  form: { control, setValue, getValues },
}: UseFormWatchersProps) {
  const { title: titleFromStore, comments: commentsFromStore } =
    useStepFourState();

  /**
   * SCORE UPDATES - UPDATE EVALUATIONS IN THE FORM
   *
   * @description This is needed to sync the form state with the (default) calculated score -
   *
   * @remark If a overall score is manually entered, this will always be the source of truth for the form value, and will become the default value shown in the input.
   *
   * @remark The submit to the server may never recalculate the score, but all subskills and module states will be passed on with their own score
   */
  useWatch({
    control,
    name: "overallScore",
    compute: (overallScore) => {
      const currentEvaluations = getValues().evaluations;

      // Let it init first
      if (currentEvaluations?.length === 0) {
        return;
      }

      const entries = Object.entries(overallScore ?? {});

      if (entries.length > 0) {
        const { isModified, evaluations: newEvaluations } = buildNewEvaluation(
          entries,
          currentEvaluations,
        );

        if (!isModified) {
          return;
        }

        setValue("evaluations", newEvaluations);
      }
    },
  });

  /**
   * TITLE - SYNC THE TITLE FIELD WITH THE STORE
   */
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

  /**
   * COMMENTS - SYNC THE COMMENTS FIELD WITH THE STORE
   */
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
}
