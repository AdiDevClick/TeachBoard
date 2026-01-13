import type { SimpleAvatarProps } from "@/components/Avatar/types/avatar.types.ts";
import type { SimpleAddButtonWithToolTipProps } from "@/components/Buttons/types/ButtonTypes.ts";
import { DEV_MODE, NO_COMPONENT_WARNING_LOGS } from "@/configs/app.config.ts";
import { checkPropsValidity } from "@/utils/utils.ts";

//                    ------------

/**
 * Validates props for LaballedInputForController component.
 *
 * {@link import("@/components/Inputs/LaballedInputForController.tsx").LabelledInputForController }
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
 * {@link import("@/components/HOCs/withController.tsx").default}
 */
const CONTROLLER_REQUIRES = ["form", "name"];

export const controllerPropsInvalid = (props: Record<string, unknown>) =>
  checkPropsValidity(props, CONTROLLER_REQUIRES, []);

//                    ------------

/**
 * Validation requirements for withListMapper HOC.
 *
 * {@link import("@/components/HOCs/withListMapper.tsx").default}
 */
const LIST_MAPPER_REQUIRES = ["items"];

export const listMapperContainsInvalid = (props: Record<string, unknown>) =>
  checkPropsValidity(props, LIST_MAPPER_REQUIRES, []);

//                    ------------

/**
 * Validation requirements for LoginButton component.
 *
 * {@link import("@/components/Buttons/LoginButton.tsx").LoginButton}
 */
const LOGIN_BUTTON_REQUIRES = ["name", "path"];

export const loginButtonContainsInvalid = (props: Record<string, unknown>) =>
  checkPropsValidity(props, LOGIN_BUTTON_REQUIRES, []);

//                    ------------

/** Validation requirements for MenuButton component.
 *
 * {@link import("@/components/Sidebar/nav/elements/menu_button/PrimaryMenuButton.tsx").default}
 */
const MENU_BUTTON_REQUIRES = ["item"];

export const menuButtonContainsInvalid = (props: Record<string, unknown>) =>
  checkPropsValidity(props, MENU_BUTTON_REQUIRES, []);

//                    ------------

/** Validation requirements for MenuButton component.
 *
 * {@link import("@/components/Command/CommandItems.tsx").CommandItems}
 */
const COMMAND_GROUP_REQUIRES = ["items", "groupTitle"];
const COMMAND_ITEM_REQUIRES = ["id", "value"];
const COMMAND_SELECTION_REQUIRES = ["id"];

export const commandGroupContainsInvalid = (props: Record<string, unknown>) =>
  checkPropsValidity(props, COMMAND_GROUP_REQUIRES, []);

export const commandItemContainsInvalid = (props: Record<string, unknown>) =>
  checkPropsValidity(props, COMMAND_ITEM_REQUIRES, []);

export const commandSelectionDoesNotContainId = (
  props: Record<string, unknown>
) => checkPropsValidity(props, COMMAND_SELECTION_REQUIRES, []);

//                    ------------

/**
 * Validation requirements for SimpleAvatar component.
 *
 * {@link import("@/components/Avatar/SimpleAvatar.tsx").SimpleAvatar}
 */
const SIMPLE_AVATAR_REQUIRES = ["src", "alt", "fallback"];

export function simpleAvatarPropsInvalid(props: SimpleAvatarProps) {
  return checkPropsValidity(props, SIMPLE_AVATAR_REQUIRES, []);
}

//                    ------------

/**
 * Validation requirements for SimpleAddButtonWithToolTip component.
 *
 * {@link import("@/components/Buttons/SimpleAddButton.tsx").SimpleAddButtonWithToolTip}
 */
const SIMPLE_ADD_BUTTON_REQUIRES = ["toolTipText"];

export function simpleAddButtonWithToolTipPropsInvalid(
  props: SimpleAddButtonWithToolTipProps
) {
  return checkPropsValidity(props, SIMPLE_ADD_BUTTON_REQUIRES, []);
}

//                    ------------

/**
 * Validation requirements for useCommandHandler component handleOpening() callback.
 *
 * Used by {@link useCommandHandler}
 */
const FETCH_PARAMS_REQUIRES = ["contentId", "apiEndpoint", "dataReshapeFn"];
export const fetchParamsPropsInvalid = (props: Record<string, unknown>) =>
  checkPropsValidity(props, FETCH_PARAMS_REQUIRES, []);

//                    ------------

/**
 * Validation requirements for Task Modal components.
 *
 * Used by {@link ClassCreationController} trying to open Task Modals.
 */
const TASK_MODAL_REQUIRES = ["id"];

export const taskModalPropsInvalid = (props: unknown) =>
  checkPropsValidity(props, TASK_MODAL_REQUIRES, []);

//                    ------------

/**
 * Validation requirements for withInlineItemAndSwitchSelection HOC.
 */
const INLINE_ITEM_AND_SWITCH_SELECTION_REQUIRES = ["title"];

export const inlineItemAndSwitchSelectionPropsInvalid = (
  props: Record<string, unknown>
) => checkPropsValidity(props, INLINE_ITEM_AND_SWITCH_SELECTION_REQUIRES, []);

/**
 * Logs debug information for a component when in development mode.
 *
 * @param componentName - The name of the component for logging purposes.
 */
export function debugLogs(componentName: string, details?: unknown) {
  if (DEV_MODE && !NO_COMPONENT_WARNING_LOGS) {
    console.debug(
      `[${componentName}] - Invalid props detected. Please check the component configuration.`,
      details
    );
  }
}
