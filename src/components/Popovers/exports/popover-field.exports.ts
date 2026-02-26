import withComboBoxCommands from "@/components/HOCs/withComboBoxCommands";
import withController from "@/components/HOCs/withController";
import { withEventEnrichedMetadatas } from "@/components/HOCs/withEventEnrichedMetadatas";
import withListMapper from "@/components/HOCs/withListMapper";
import PopoverField from "@/components/Popovers/PopoverField";
import { createComponentName } from "@/utils/utils";

/**
 * @file,
overview This file exports various versions of the PopoverField component, each enhanced with different combinations of HOCs for form control and command handling.
 * It serves as a central export point for the PopoverField component, allowing for cleaner imports in other parts of the application.
 */

/**
 * A version that maps a list of command items to the PopoverField component with command handling capabilities.
 */
export const PopoverFieldWithCommandsBase = withComboBoxCommands(PopoverField);
createComponentName(
  "withComboBoxCommands",
  "PopoverFieldWithCommandsBase",
  PopoverFieldWithCommandsBase,
);

/**
 * A convenience export already wrapped with `withEventEnrichedMetadatas`.
 *
 * This is the prefered basic version since it is already wrapped with form controller metadata.
 */
export const PopoverFieldWithCommands = withEventEnrichedMetadatas(
  PopoverFieldWithCommandsBase,
);
createComponentName(
  "withEventEnrichedMetadatas",
  "PopoverFieldWithCommands",
  PopoverFieldWithCommands,
);

/**
 * A version that uses the `withEventEnrichedMetadatas` HOC to integrate with react-hook-form's Controller, forwarding form field props and command metadata.
 */
export const PopoverFieldWithControlledCommands = withController(
  PopoverFieldWithCommands,
);
createComponentName(
  "withController",
  "PopoverFieldWithControlledCommands",
  PopoverFieldWithControlledCommands,
);

/**
 * List-mapped variant of the controller+commands popover.
 */
export const PopoverFieldWithControllerAndCommandsList = withListMapper(
  PopoverFieldWithControlledCommands,
);
createComponentName(
  "withListMapper",
  "PopoverFieldWithControllerAndCommandsList",
  PopoverFieldWithControllerAndCommandsList,
);
