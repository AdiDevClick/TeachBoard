import withListMapper from "@/components/HOCs/withListMapper";
import { LabelledScore } from "@/features/evaluations/main/components/score/LabelledScore";
import { LabelledScoreInput } from "@/features/evaluations/main/components/score/LabelledScoreInput";
import { createComponentName } from "@/utils/utils";

/**
 * @fileoverview Exports the LabelledScoreInputList component, which is a list of LabelledScoreInput components wrapped with the withListMapper HOC.
 *
 * @exports LabelledScoreInputList - A list of LabelledScoreInput components.
 */

/**
 * A version of the LabelledScoreInput component that can be used to display a list of scores for multiple students.
 */
export const LabelledScoreInputList = withListMapper(LabelledScoreInput);
createComponentName(
  "withListMapper",
  "LabelledScoreInputList",
  LabelledScoreInputList,
);

/**
 * A version of the LabelledScore component that can be used to display a list of average scores for multiple students with no inputs fields.
 */
export const LabelledScoreList = withListMapper(LabelledScore);

createComponentName("withListMapper", "LabelledScoreList", LabelledScoreList);
