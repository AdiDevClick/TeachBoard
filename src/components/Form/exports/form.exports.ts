import { AvatarListWithLabelAndAddButton } from "@/components/Form/AvatarListWithLabelAndAddButton";
import withListMapper from "@/components/HOCs/withListMapper";
import { createComponentName } from "@/utils/utils";
/**
 * @fileoverview This file exports the AvatarListWithLabelAndAddButton component and its variations with HOCs for form control and list mapping.
 */

/**
 * A list version of the AvatarListWithLabelAndAddButton component
 */
export const AvatarsWithLabelAndAddButtonList = withListMapper(
  AvatarListWithLabelAndAddButton,
);
createComponentName(
  "withListMapper",
  "AvatarsWithLabelAndAddButtonList",
  AvatarsWithLabelAndAddButtonList,
);
