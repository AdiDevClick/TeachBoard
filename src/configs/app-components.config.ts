import { LoginButton } from "@/components/Buttons/LoginButton.tsx";
import withController from "@/components/HOCs/withController.tsx";
import withListMapper from "@/components/HOCs/withListMapper.tsx";
import { LaballedInputForController } from "@/components/Inputs/LaballedInputForController.tsx";
import { PrimaryMenuButton } from "@/components/Sidebar/nav/elements/menu_button/PrimaryMenuButton.tsx";
import { DEV_MODE, NO_COMPONENT_WARNING_LOGS } from "@/configs/app.config.ts";
import { checkPropsValidity } from "@/utils/utils.ts";

/**
 * Validation function for LaballedInputForController props.
 *
 * {@link LaballedInputForController }
 */
const LABELLED_INPUT_SHOULD_NOT_ACCEPT = ["useCommands", "creationButtonText"];
const LABELLED_INPUT_REQUIRES = ["field", "fieldState"];

/**
 * Validation requirements for withController HOC.
 *
 * {@link withController}
 */
const CONTROLLER_REQUIRES = ["form", "name"];

/**
 * Validation requirements for withListMapper HOC.
 *
 * {@link withListMapper}
 */
const LIST_MAPPER_REQUIRES = ["items"];

/**
 * Validation requirements for LoginButton component.
 *
 * {@link LoginButton}
 */
const LOGIN_BUTTON_REQUIRES = ["name", "path"];

/** Validation requirements for MenuButton component.
 *
 * {@link PrimaryMenuButton}
 */
const MENU_BUTTON_REQUIRES = ["item"];

/**
 * Validates props for LaballedInputForController component.
 *
 * @param props - Props to validate
 * @returns true if props are invalid, false otherwise
 */
export const labelledInputContainsInvalid = (props: Record<string, unknown>) =>
  checkPropsValidity(
    props,
    LABELLED_INPUT_REQUIRES,
    LABELLED_INPUT_SHOULD_NOT_ACCEPT
  );

export const controllerPropsInvalid = (props: Record<string, unknown>) =>
  checkPropsValidity(props, CONTROLLER_REQUIRES, []);

export const listMapperContainsInvalid = (props: Record<string, unknown>) =>
  checkPropsValidity(props, LIST_MAPPER_REQUIRES, []);

export const loginButtonContainsInvalid = (props: Record<string, unknown>) =>
  checkPropsValidity(props, LOGIN_BUTTON_REQUIRES, []);

export const menuButtonContainsInvalid = (props: Record<string, unknown>) =>
  checkPropsValidity(props, MENU_BUTTON_REQUIRES, []);

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
