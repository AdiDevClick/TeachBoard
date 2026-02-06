import withController from "@/components/HOCs/withController";
import { DynamicTags } from "@/components/Tags/DynamicTags";

/**
 * Export a controller-wrapped version of the DynamicTags component for use in forms.
 */
export const ControlledDynamicTagList = withController(DynamicTags);
