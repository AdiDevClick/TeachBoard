import withListMapper from "@/components/HOCs/withListMapper";
import { LabelledScoreInput } from "@/features/evaluations/create/components/Score/LabelledScoreInput";

/**
 * @fileoverview Exports the LabelledScoreInputList component, which is a list of LabelledScoreInput components wrapped with the withListMapper HOC.
 *
 * @exports LabelledScoreInputList - A list of LabelledScoreInput components.
 */

/**
 * A version of the LabelledScoreInput component that can be used to display a list of scores for multiple students.
 */
export const LabelledScoreInputList = withListMapper(LabelledScoreInput);
