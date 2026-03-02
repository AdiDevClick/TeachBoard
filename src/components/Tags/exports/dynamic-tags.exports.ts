import withController from "@/components/HOCs/withController";
import { DynamicTags } from "@/components/Tags/DynamicTags";
import { createComponentName } from "@/utils/utils";

/**
 * Export a controller-wrapped version of the DynamicTags component for use in forms.
 */
export const ControlledDynamicTagList = withController(DynamicTags);
createComponentName(
  "withController",
  "ControlledDynamicTagList",
  ControlledDynamicTagList,
);
