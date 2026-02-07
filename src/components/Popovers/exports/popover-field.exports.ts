import withComboBoxCommands from "@/components/HOCs/withComboBoxCommands";
import withController from "@/components/HOCs/withController";
import withListMapper from "@/components/HOCs/withListMapper";
import PopoverField, {
  ForController,
} from "@/components/Popovers/PopoverField";

/**
 * This file exports different variations of the PopoverField component, each enhanced with specific functionalities through Higher-Order Components (HOCs)
 */

/**
 * A version that allows it to be used in forms with controller support.
 */
const PopoverFieldForController = ForController(PopoverField);

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
  ForController(withComboBoxCommands(PopoverField)),
);

/**
 * A version that maps a list of command items to the PopoverField component with command handling capabilities.
 */
export const PopoverFieldWithCommands = withComboBoxCommands(PopoverField);

/**
 * A version that maps a list of command items to the PopoverField component with controller and command handling capabilities.
 */
export const PopoverFieldWithControlledCommands = withController(
  ForController(PopoverFieldWithCommands),
);

/**
 * A version that maps a list of command items to the PopoverField component with controller and command handling capabilities.
 */
export const PopoverFieldWithControllerAndCommandsList = withListMapper(
  PopoverFieldWithControlledCommands,
);
