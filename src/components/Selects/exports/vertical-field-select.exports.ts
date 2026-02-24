import { forController } from "@/components/HOCs/forController";
import withController from "@/components/HOCs/withController";
import { withInlineItemAndSwitchSelection } from "@/components/HOCs/withInlineItemAndSwitchSelection";
import withListMapper from "@/components/HOCs/withListMapper";
import { WithListings } from "@/components/Selects/helpers/vertical-field-select.helpers";
import VerticalFieldSelect from "@/components/Selects/VerticalFieldSelect";
import { createComponentName } from "@/utils/utils";
/**
 * @fileoverview This file exports different variations of the VerticalFieldSelect component, each enhanced with specific functionalities through Higher-Order Components (HOCs).
 * It serves as a central export point for the VerticalFieldSelect component, allowing for cleaner imports in other parts of the application.
 */

/**
 * A version that allows it to be used in forms with controller support.
 */
const VerticalFieldSelectForController = forController(VerticalFieldSelect);
createComponentName(
  "forController",
  "VerticalFieldSelectForController",
  VerticalFieldSelectForController,
);

/**
 * A version that includes listing capabilities, allowing it to display a list of items.
 */
export const VerticalFieldSelectWithListings =
  WithListings(VerticalFieldSelect);
createComponentName(
  "WithListings",
  "VerticalFieldSelectWithListings",
  VerticalFieldSelectWithListings,
);

/**
 * A controller-wrapped version of the VerticalFieldSelect component for use in forms.
 */
export const VerticalFieldSelectWithController = withController(
  VerticalFieldSelectForController,
);
createComponentName(
  "withController",
  "VerticalFieldSelectWithController",
  VerticalFieldSelectWithController,
);

/**
 * A version that combines controller support with inline item and switch selection capabilities.
 */
export const VerticalFieldSelectWithControllerAndInlineSwitch = withController(
  forController(
    withInlineItemAndSwitchSelection(VerticalFieldSelectWithListings),
  ),
);
createComponentName(
  "withController",
  "VerticalFieldSelectWithControllerAndInlineSwitch",
  VerticalFieldSelectWithControllerAndInlineSwitch,
);

/**
 * A version that maps a list of items to the VerticalFieldSelect component with inline switch selection.
 */
export const VerticalFieldWithInlineSwitchList = withListMapper(
  VerticalFieldSelectWithControllerAndInlineSwitch,
);
createComponentName(
  "withListMapper",
  "VerticalFieldWithInlineSwitchList",
  VerticalFieldWithInlineSwitchList,
);
