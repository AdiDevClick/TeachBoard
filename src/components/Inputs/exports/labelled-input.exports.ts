import withController from "@/components/HOCs/withController";
import { withEventEnrichedMetadatas } from "@/components/HOCs/withEventEnrichedMetadatas";
import withListMapper from "@/components/HOCs/withListMapper";
import { LabelledInput } from "@/components/Inputs/LabelledInput";
import { createComponentName } from "@/utils/utils";

/**
 * @fileoverview This file exports the LabelledInput component and its variations with HOCs for form control and list mapping.
 * It serves as a central export point for the LabelledInput component, allowing for cleaner imports in other parts of the application.
 */

/**
 * A version of the LabelledInput component that is integrated with react-hook-form Controller.
 */
export const LabelledInputWithEventEnrichedMetadatas =
  withEventEnrichedMetadatas(LabelledInput);
createComponentName(
  "withEventEnrichedMetadatas",
  "LabelledInputWithEventEnrichedMetadatas",
  LabelledInputWithEventEnrichedMetadatas,
);

/**
 * A version of the LabelledInput component that is integrated with react-hook-form Controller and enhanced with list mapping capabilities.
 */
export const ControlledLabelledInput = withController(
  LabelledInputWithEventEnrichedMetadatas,
);
createComponentName(
  "withController",
  "ControlledLabelledInput",
  ControlledLabelledInput,
);

/**
 *  A version of the LabelledInput component that is integrated with react-hook-form Controller and enhanced with list mapping capabilities.
 */
export const ControlledInputList = withListMapper(ControlledLabelledInput);
createComponentName(
  "withListMapper",
  "ControlledInputList",
  ControlledInputList,
);
