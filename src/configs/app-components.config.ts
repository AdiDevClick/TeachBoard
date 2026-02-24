import type { SimpleAvatarProps } from "@/components/Avatar/types/avatar.types.ts";
import type { AppBreadCrumbListProps } from "@/components/BreadCrumbs/types/breadcrumbs.types";
import type { SimpleAddButtonWithToolTipProps } from "@/components/Buttons/types/ButtonTypes.ts";
import type { CommandItemType } from "@/components/Command/types/command.types.ts";
import type { DropdownsProps } from "@/components/Dropdowns/types/dropdowns.types";
import type { AvatarListWithLabelAndAddButtonProps } from "@/components/Form/types/form.types";
import type { LabelledInputProps } from "@/components/Inputs/types/inputs.types";
import type {
  EvaluationRadioItemDescriptionProps,
  EvaluationRadioItemProps,
} from "@/components/Radio/types/radio.types.ts";
import type { NonLabelledGroupItemProps } from "@/components/Selects/types/select.types";
import type { EvaluationSliderProps } from "@/components/Sliders/types/sliders.types.ts";
import type { LabelledTextAreaProps } from "@/components/TextAreas/types/textareas.types";
import { DEV_MODE, NO_COMPONENT_WARNING_LOGS } from "@/configs/app.config.ts";
import type { LoginFormControllerProps } from "@/features/auth/components/login/controller/types/login-form-controller.types";
import type { ClassCreationControllerProps } from "@/features/class-creation/class-creation.index.ts";
import type {
  StepThreeControllerProps,
  StepThreeModuleSelectionControllerProps,
  StepThreeSubskillsSelectionControllerProps,
} from "@/features/evaluations/create/steps/three/types/step-three.types.ts";
import type { LeftContentProps } from "@/features/evaluations/create/types/create.types.ts";
import type {
  CommandHandlerMetaData,
  HandleOpeningCallbackParams,
} from "@/hooks/database/types/use-command-handler.types.ts";
import type { AnyObjectProps } from "@/utils/types/types.utils";
import { checkPropsValidity } from "@/utils/utils.ts";
import type { AccordionItemProps } from "@radix-ui/react-accordion";
import type { FieldValues } from "react-hook-form";

//                    ------------

/**
 * Validates props for LabelledInputForController component.
 *
 * {@link import("@/components/Inputs/LabelledInput.tsx").LabelledInput }
 */
const LABELLED_INPUT_SHOULD_NOT_ACCEPT = ["useCommands", "creationButtonText"];
const LABELLED_INPUT_REQUIRES = ["name"];

export const labelledInputContainsInvalid = (props: LabelledInputProps) =>
  checkPropsValidity(
    props as unknown as AnyObjectProps,
    LABELLED_INPUT_REQUIRES,
    LABELLED_INPUT_SHOULD_NOT_ACCEPT,
  );

//                    ------------

/**
 * Validation requirements for AppBreadCrumb component.
 *
 * {@link import("@/components/BreadCrumbs/AppBreadCrumb.tsx").AppBreadCrumb}
 */
const APP_BREADCRUMB_REQUIRES = ["segmentsLength"];
const APP_BREADCRUMB_SHOULD_NOT_ACCEPT = ["useCommands", "creationButtonText"];

export const appBreadCrumbPropsInvalid = (props: AnyObjectProps) =>
  checkPropsValidity(
    props,
    APP_BREADCRUMB_REQUIRES,
    APP_BREADCRUMB_SHOULD_NOT_ACCEPT,
  );

//                    ------------

/**
 * Validation requirements for AppBreadCrumbSegment component.
 *
 * {@link import("@/components/BreadCrumbs/AppBreadCrumbSegment.tsx").AppBreadCrumbSegment}
 */

const AVATAR_LIST_WITH_LABEL_AND_ADD_BUTTON_REQUIRES = ["items"];
export const avatarListWithLabelAndAddButtonPropsInvalid = (
  props: AvatarListWithLabelAndAddButtonProps,
) =>
  checkPropsValidity(props, AVATAR_LIST_WITH_LABEL_AND_ADD_BUTTON_REQUIRES, []);

//                    ------------

/**
 * Validation requirements for AppBreadCrumbList component.
 *
 * {@link import("@/components/BreadCrumbs/AppBreadCrumbList.tsx").AppBreadCrumbList}
 */

const APP_BREADCRUMB_LIST_REQUIRES = ["items"];

export const appBreadCrumbListPropsInvalid = (props: AppBreadCrumbListProps) =>
  checkPropsValidity(props, APP_BREADCRUMB_LIST_REQUIRES, []);

//                    ------------

/**
 * Validation requirements for ListMapper component.
 *
 * {@link import("@/components/Lists/ListMapper.tsx").ListMapper }
 */
const SUBSKILLS_WITH_STUDENTS_REQUIRES = [
  "storeGetter",
  "module",
  "valueGetter",
  "index",
  "isCompleted",
  "isDisabled",
];

export const subSkillWithStudentsPropsInvalid = (props: AnyObjectProps) =>
  checkPropsValidity(props, SUBSKILLS_WITH_STUDENTS_REQUIRES, []);

//                    ------------

/**
 * Validation requirements for withAccordionItem HOC.
 *
 * {@link import("@/features/evaluations/create/components/HOCs/withAccordionItem.tsx").withAccordionItem }
 */
const WITH_ACCORDION_ITEM_REQUIRES = ["value", "name"];

export const withAccordionItemPropsInvalid = (props: AccordionItemProps) =>
  checkPropsValidity(props as any, WITH_ACCORDION_ITEM_REQUIRES, []);

//                    ------------

/**
 * Validates props for LabelledInputForController component.
 *
 * {@link import("@/components/HOCs/forController.tsx").forController }
 */
const FOR_CONTROLLER_REQUIRES = ["field", "fieldState"];
export const forControllerContainsInvalid = (props: FieldValues) =>
  checkPropsValidity(props, FOR_CONTROLLER_REQUIRES, []);

//                    ------------

/**
 * Validation requirements for LabelledTextAreaForController component.
 *
 * {@link import("@/components/Inputs/LabelledTextAreaForController.tsx").LabelledTextAreaForController }
 */
const LABELLED_TEXTAREA_REQUIRES = ["name", "title"];

export const labelledTextAreaContainsInvalid = (props: LabelledTextAreaProps) =>
  checkPropsValidity(
    props as unknown as AnyObjectProps,
    LABELLED_TEXTAREA_REQUIRES,
    [],
  );

//                    ------------

/**
 * Validation requirements for withController HOC.
 *
 * {@link import("@/components/HOCs/withController.tsx").default}
 */
const CONTROLLER_REQUIRES = ["form", "name"];

export const controllerPropsInvalid = (props: AnyObjectProps) =>
  checkPropsValidity(props, CONTROLLER_REQUIRES, []);

//                    ------------

/**
 * Validation requirements for LeftSidePageContent.
 */
const LEFT_SIDE_PAGE_CONTENT_REQUIRES = [
  { item: ["title", "number"] },
  "isClicked",
];

export const leftSidePageContentPropsInvalid = (props: LeftContentProps) =>
  checkPropsValidity(props, LEFT_SIDE_PAGE_CONTENT_REQUIRES, []);

//                    ------------

/**
 * Validation requirements for withListMapper HOC.
 *
 * {@link import("@/components/HOCs/withListMapper.tsx").default}
 */
const LIST_MAPPER_REQUIRES = ["items"];

export const listMapperContainsInvalid = (props: AnyObjectProps) =>
  checkPropsValidity(props, LIST_MAPPER_REQUIRES, []);

//                    ------------

/**
 * Validation requirements for LoginButton component.
 *
 * {@link import("@/components/Buttons/LoginButton.tsx").LoginButton}
 */
const LOGIN_BUTTON_REQUIRES = ["name", "path"];

export const loginButtonContainsInvalid = (props: AnyObjectProps) =>
  checkPropsValidity(props, LOGIN_BUTTON_REQUIRES, []);

//                    ------------

/** Validation requirements for MenuButton component.
 *
 * {@link import("@/components/Sidebar/nav/elements/menu_button/PrimaryMenuButton.tsx").default}
 */
const MENU_BUTTON_REQUIRES = ["item"];

export const menuButtonContainsInvalid = (props: AnyObjectProps) =>
  checkPropsValidity(props, MENU_BUTTON_REQUIRES, []);

//                    ------------

/** Validation requirements for MenuButton component.
 *
 * {@link import("@/components/Command/CommandItems.tsx").CommandItems}
 */
const COMMAND_GROUP_REQUIRES = ["items", "groupTitle"];
const COMMAND_ITEM_REQUIRES = ["id", "value"];
const COMMAND_SELECTION_REQUIRES = ["id"];

export const commandGroupContainsInvalid = (props: AnyObjectProps) =>
  checkPropsValidity(props, COMMAND_GROUP_REQUIRES, []);

export const commandItemContainsInvalid = (props: AnyObjectProps) =>
  checkPropsValidity(props, COMMAND_ITEM_REQUIRES, []);

export const commandSelectionDoesNotContainId = (props: AnyObjectProps) =>
  checkPropsValidity(props, COMMAND_SELECTION_REQUIRES, []);

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
  props: SimpleAddButtonWithToolTipProps,
) {
  return checkPropsValidity(props, SIMPLE_ADD_BUTTON_REQUIRES, []);
}

//                    ------------

/**
 * Validation requirements for useCommandHandler component handleOpening() callback.
 *
 * Used by {@link useCommandHandler}
 */
const FETCH_PARAMS_REQUIRES = ["task", "apiEndpoint", "dataReshapeFn"];
export const fetchParamsPropsInvalid = <T extends CommandHandlerMetaData>(
  props: HandleOpeningCallbackParams<T>["metaData"],
) => checkPropsValidity(props!, FETCH_PARAMS_REQUIRES, []);

//                    ------------

/**
 * Validation requirements for Task Modal components.
 *
 * Used by {@link ClassCreationController} trying to open Task Modals.
 */
const TASK_MODAL_REQUIRES = ["id"];

export const taskModalPropsInvalid = (props: Pick<CommandItemType, "id">) =>
  checkPropsValidity(props, TASK_MODAL_REQUIRES, []);

//                    ------------

/**
 * Validation requirements for withInlineItemAndSwitchSelection HOC.
 */
const INLINE_ITEM_AND_SWITCH_SELECTION_REQUIRES = ["title"];

export const inlineItemAndSwitchSelectionPropsInvalid = (
  props: AnyObjectProps,
) => checkPropsValidity(props, INLINE_ITEM_AND_SWITCH_SELECTION_REQUIRES, []);

//                    ------------

/**
 * Validation requirements for EvaluationRadioItem.
 */
const EVALUATION_RADIO_ITEM_REQUIRES = ["id", "name"];

export const evaluationRadioItemPropsInvalid = (
  props: EvaluationRadioItemProps & AnyObjectProps,
) => checkPropsValidity(props, EVALUATION_RADIO_ITEM_REQUIRES, []);

//                    ------------

/**
 * Validation requirements for Dropdown.
 *
 * {@link import("@/components/Dropdowns/Dropdown.tsx").Dropdown}
 */
const DROPDOWN_REQUIRES = ["title"];

export const dropdownPropsInvalid = (props: DropdownsProps) =>
  checkPropsValidity(props as any, DROPDOWN_REQUIRES, []);

//                    ------------

/**
 * Validation requirements for EvaluationRadioItemDescription.
 */
const EVALUATION_RADIO_ITEM_DESCRIPTION_REQUIRES = ["id", "subSkills"];

export const evaluationRadioItemDescriptionPropsInvalid = (
  props: EvaluationRadioItemDescriptionProps,
) => checkPropsValidity(props, EVALUATION_RADIO_ITEM_DESCRIPTION_REQUIRES, []);

//                    ------------

const BASE_CONTROLLERS_PROPS_REQUIRES = ["form", "pageId", "formId"];

/**
 * Validation requirements for ClassCreationController.
 *
 * {@link import("@/pages/Classes/create/controller/ClassCreationController.tsx").ClassCreationController}
 */

const CLASS_CREATION_CONTROLLER_REQUIRES = [
  ...BASE_CONTROLLERS_PROPS_REQUIRES,
  "inputControllers",
  "className",
  "submitRoute",
  "submitDataReshapeFn",
];

export const classCreationControllerPropsInvalid = (
  props: ClassCreationControllerProps,
) => checkPropsValidity(props, CLASS_CREATION_CONTROLLER_REQUIRES, []);

//                    ------------

/**
 * Validation requirements for Login Form Controller.
 *
 * {@link import("@/features/auth/components/login/controller/LoginFormController.tsx").LoginFormController}
 */
const LOGIN_FORM_CONTROLLER_REQUIRES = [
  ...BASE_CONTROLLERS_PROPS_REQUIRES,
  "setIsPwForgotten",
  "isPwForgotten",
];

export const loginFormControllerPropsInvalid = (
  props: LoginFormControllerProps,
) => checkPropsValidity(props, LOGIN_FORM_CONTROLLER_REQUIRES, []);
//                    ------------

/**
 * Validation requirements for StepThreeController.
 */
const STEP_THREE_CONTROLLER_REQUIRES = [
  ...BASE_CONTROLLERS_PROPS_REQUIRES,
  "modules",
];

export const stepThreeControllerPropsInvalid = (
  props: StepThreeControllerProps,
) => checkPropsValidity(props, STEP_THREE_CONTROLLER_REQUIRES, []);

const STEP_THREE_SUBSKILLS_SELECTION_CONTROLLER_REQUIRES = ["isActive"];
export const stepThreeSubskillsSelectionControllerPropsInvalid = (
  props: StepThreeSubskillsSelectionControllerProps,
) =>
  checkPropsValidity(
    props,
    STEP_THREE_SUBSKILLS_SELECTION_CONTROLLER_REQUIRES,
    [],
  );

const STEP_THREE_MODULE_SELECTION_CONTROLLER_REQUIRES = [
  ...BASE_CONTROLLERS_PROPS_REQUIRES,
  "modules",
];

export const stepThreeModuleSelectionControllerPropsInvalid = (
  props: StepThreeModuleSelectionControllerProps,
) =>
  checkPropsValidity(
    props,
    STEP_THREE_MODULE_SELECTION_CONTROLLER_REQUIRES,
    [],
  );

//                    ------------

/**
 * Validation requirements for Slider component.
 *
 * {@link import("@/components/Sliders/EvaluationSlider.tsx").EvaluationSlider}
 */
const SLIDER_REQUIRES = ["value", "fullName"];

export const evaluationSliderPropsValid = (props: EvaluationSliderProps) =>
  checkPropsValidity(props, SLIDER_REQUIRES, []);

//                    ------------

/**
 * Validation requirements for the VerticalField's helper WithListings
 */
const WITH_LISTINGS_REQUIRES = ["items"];

export const withListingsPropsInvalid = (props: AnyObjectProps) =>
  checkPropsValidity(props, WITH_LISTINGS_REQUIRES, []);

//                    ------------

/**
 * Validation requirements for NonLabelledGroupItem.
 */
const NON_LABELLED_GROUP_ITEM_REQUIRES = ["id", "name"];

export const nonLabelledGroupItemPropsInvalid = (
  props: NonLabelledGroupItemProps,
) => checkPropsValidity(props, NON_LABELLED_GROUP_ITEM_REQUIRES, []);

//                    ------------

/**
 * Logs debug information for a component when in development mode.
 *
 * @param componentName - The name of the component for logging purposes.
 */
export function debugLogs(componentName: string, details?: unknown) {
  if (DEV_MODE && !NO_COMPONENT_WARNING_LOGS) {
    console.error(
      `[${componentName}] - Invalid props detected. Please check the component configuration.`,
      details,
    );
  }
}
