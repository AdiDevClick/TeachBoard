import withController from "@/components/HOCs/withController";
import { withDynamicFieldArray } from "@/components/HOCs/withDynamicFieldArray";
import { LabelledTextArea } from "@/components/TextAreas/LabelledTextArea";
import { CriteriaInput } from "@/features/class-creation/components/DegreeModuleSkill/components/inputs/CriteriaInput";
import { ScoreCriteria } from "@/features/class-creation/components/DegreeModuleSkill/components/scores/ScoreCriteria";
import type { ScoreCriteriaProps } from "@/features/class-creation/components/DegreeModuleSkill/components/scores/types/score-criteria.types";
import { createComponentName } from "@/utils/utils";

/**
 * Controlled Title & Textarea
 */
export const ControlledTextArea = withController(LabelledTextArea);
createComponentName("withController", "ControlledTextArea", ControlledTextArea);

/**
 * Controlled Slider with a title representing the score threshold and a button to remove the criteria.
 */
export const ControlledCriteriaInput = withController(CriteriaInput);
createComponentName(
  "withController",
  "ControlledCriteriaInput",
  ControlledCriteriaInput,
);

/**
 * A Field set of multiple criteria inputs, that can be dynamically added or removed by the user by clicking the `add  button`. Each criteria consists of a score threshold input and a description textarea.
 * This component is designed to be used within a dynamic field array, enabling the addition and removal of criteria as needed.
 */
export const DynamicCriteriaList =
  withDynamicFieldArray<ScoreCriteriaProps>(ScoreCriteria);
createComponentName(
  "withDynamicFieldArray",
  "DynamicCriteriaList",
  DynamicCriteriaList,
);
