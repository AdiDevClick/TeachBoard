import withController from "@/components/HOCs/withController";
import { withEventEnrichedMetadatas } from "@/components/HOCs/withEventEnrichedMetadatas";
import withListMapper from "@/components/HOCs/withListMapper";
import { LabelledTextArea } from "@/components/TextAreas/LabelledTextArea";
import { createComponentName } from "@/utils/utils";

/**
 * @fileoverview This file exports the LabelledTextArea component and its variations with HOCs for form control and list mapping.
 * It serves as a central export point for the LabelledTextArea component, allowing for cleaner imports in other parts of the application.
 */

/**
 * A version of the LabelledTextArea component that is integrated with react-hook-form Controller.
 */
export const ControlledLabelledTextArea = withController(
  withEventEnrichedMetadatas(LabelledTextArea),
);
createComponentName(
  "withController",
  "ControlledLabelledTextArea",
  ControlledLabelledTextArea,
);

/**
 * A version of the LabelledTextArea component that is integrated with react-hook-form Controller and enhanced with list mapping capabilities.
 */
export const ControlledLabelledTextAreaList = withListMapper(
  ControlledLabelledTextArea,
);
createComponentName(
  "withListMapper",
  "ControlledLabelledTextAreaList",
  ControlledLabelledTextAreaList,
);
