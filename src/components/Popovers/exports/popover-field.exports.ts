import { forController } from "@/components/HOCs/forController";
import withComboBoxCommands from "@/components/HOCs/withComboBoxCommands";
import withController from "@/components/HOCs/withController";
import withListMapper from "@/components/HOCs/withListMapper";
import PopoverField from "@/components/Popovers/PopoverField";

/**
 * @fileoverview This file exports various versions of the PopoverField component, each enhanced with different combinations of HOCs for form control and command handling.
 * It serves as a central export point for the PopoverField component, allowing for cleaner imports in other parts of the application.
 */

/**
 * An enriched version that allows it to be used in forms with controller support. It includes the memoizedMetadata (endpoints,field names etc..) enrichment
 */
const PopoverFieldForController = forController(PopoverField);

/**
 * A version that includes command handling capabilities, allowing it to execute commands based on user interactions.
 */
export const PopoverFieldWithController = withController(
  PopoverFieldForController,
);

/**
 * A version that combines controller support with command handling capabilities.
 */
export const PopoverFieldWithControllerAndCommands = withController(
  forController(withComboBoxCommands(PopoverField)),
);

/**
 * A version that maps a list of command items to the PopoverField component with command handling capabilities.
 */
export const PopoverFieldWithCommands = withComboBoxCommands(PopoverField);

/**
 * A version that maps a list of command items to the PopoverField component with controller and command handling capabilities.
 */
export const PopoverFieldWithControlledCommands = withController(
  forController(PopoverFieldWithCommands),
);

/**
 * A version that maps a list of command items to the PopoverField component with controller and command handling capabilities.
 */
export const PopoverFieldWithControllerAndCommandsList = withListMapper(
  PopoverFieldWithControlledCommands,
);
