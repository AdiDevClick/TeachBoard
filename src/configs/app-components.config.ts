import { SimpleAvatar } from "@/components/Avatar/SimpleAvatar.tsx";
import type { SimpleAvatarProps } from "@/components/Avatar/types/avatar.types.ts";
import { LoginButton } from "@/components/Buttons/LoginButton.tsx";
import { SimpleAddButtonWithToolTip } from "@/components/Buttons/SimpleAddButton.tsx";
import type { SimpleAddButtonProps } from "@/components/Buttons/types/ButtonTypes.ts";
import { CommandItems } from "@/components/Command/CommandItems.tsx";
import withController from "@/components/HOCs/withController.tsx";
import withListMapper from "@/components/HOCs/withListMapper.tsx";
import { LaballedInputForController } from "@/components/Inputs/LaballedInputForController.tsx";
import PrimaryMenuButton from "@/components/Sidebar/nav/elements/menu_button/PrimaryMenuButton.tsx";
import { DEV_MODE, NO_COMPONENT_WARNING_LOGS } from "@/configs/app.config.ts";
import { checkPropsValidity } from "@/utils/utils.ts";

//                    ------------

/**
 * Validates props for LaballedInputForController component.
 *
 * {@link LaballedInputForController }
 */
const LABELLED_INPUT_SHOULD_NOT_ACCEPT = ["useCommands", "creationButtonText"];
const LABELLED_INPUT_REQUIRES = ["field", "fieldState"];

export const labelledInputContainsInvalid = (props: Record<string, unknown>) =>
  checkPropsValidity(
    props,
    LABELLED_INPUT_REQUIRES,
    LABELLED_INPUT_SHOULD_NOT_ACCEPT
  );

//                    ------------

/**
 * Validation requirements for withController HOC.
 *
 * {@link withController}
 */
const CONTROLLER_REQUIRES = ["form", "name"];

export const controllerPropsInvalid = (props: Record<string, unknown>) =>
  checkPropsValidity(props, CONTROLLER_REQUIRES, []);

//                    ------------

/**
 * Validation requirements for withListMapper HOC.
 *
 * {@link withListMapper}
 */
const LIST_MAPPER_REQUIRES = ["items"];

export const listMapperContainsInvalid = (props: Record<string, unknown>) =>
  checkPropsValidity(props, LIST_MAPPER_REQUIRES, []);

//                    ------------

/**
 * Validation requirements for LoginButton component.
 *
 * {@link LoginButton}
 */
const LOGIN_BUTTON_REQUIRES = ["name", "path"];

export const loginButtonContainsInvalid = (props: Record<string, unknown>) =>
  checkPropsValidity(props, LOGIN_BUTTON_REQUIRES, []);

//                    ------------

/** Validation requirements for MenuButton component.
 *
 * {@link PrimaryMenuButton}
 */
const MENU_BUTTON_REQUIRES = ["item"];

export const menuButtonContainsInvalid = (props: Record<string, unknown>) =>
  checkPropsValidity(props, MENU_BUTTON_REQUIRES, []);

//                    ------------

/** Validation requirements for MenuButton component.
 *
 * {@link CommandItems}
 */
const COMMAND_GROUP_REQUIRES = ["items", "groupTitle"];
const COMMAND_ITEM_REQUIRES = ["id", "value"];

export const commandGroupContainsInvalid = (props: Record<string, unknown>) =>
  checkPropsValidity(props, COMMAND_GROUP_REQUIRES, []);

export const commandItemContainsInvalid = (props: Record<string, unknown>) =>
  checkPropsValidity(props, COMMAND_ITEM_REQUIRES, []);

//                    ------------

/**
 * Validation requirements for SimpleAvatar component.
 *
 * {@link SimpleAvatar}
 */
const SIMPLE_AVATAR_REQUIRES = ["src", "alt", "fallback"];

export function simpleAvatarPropsInvalid(props: SimpleAvatarProps) {
  return checkPropsValidity(props, SIMPLE_AVATAR_REQUIRES, []);
}

//                    ------------

/**
 * Validation requirements for SimpleAddButtonWithToolTip component.
 *
 * {@link SimpleAddButtonWithToolTip}
 */
const SIMPLE_ADD_BUTTON_REQUIRES = ["toolTipText"];

export function simpleAddButtonWithToolTipPropsInvalid(
  props: SimpleAddButtonProps
) {
  return checkPropsValidity(props, SIMPLE_ADD_BUTTON_REQUIRES, []);
}

//                    ------------

/**
 * Logs debug information for a component when in development mode.
 *
 * @param componentName - The name of the component for logging purposes.
 */
export function debugLogs(componentName: string) {
  if (DEV_MODE && !NO_COMPONENT_WARNING_LOGS) {
    console.debug(
      `[${componentName}] - Invalid props detected. Please check the component configuration.`
    );
  }
}
