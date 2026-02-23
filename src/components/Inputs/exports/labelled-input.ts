import { forController } from "@/components/HOCs/forController";
import withController from "@/components/HOCs/withController";
import withListMapper from "@/components/HOCs/withListMapper";
import { LabelledInput } from "@/components/Inputs/LaballedInput";
import { createComponentName } from "@/utils/utils";

/**
 * @fileoverview This file exports the LabelledInput component and its variations with HOCs for form control and list mapping.
 * It serves as a central export point for the LabelledInput component, allowing for cleaner imports in other parts of the application.
 */

/**
 * A version of the LabelledInput component that is integrated with react-hook-form Controller.
 */
export const LabelledInputForController = forController(LabelledInput);
createComponentName(
  "forController",
  "LabelledInputForController",
  LabelledInputForController,
);

/**
 * A version of the LabelledInput component that is integrated with react-hook-form Controller and enhanced with list mapping capabilities.
 */
export const ControlledLabelledInput = withController(
  LabelledInputForController,
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
