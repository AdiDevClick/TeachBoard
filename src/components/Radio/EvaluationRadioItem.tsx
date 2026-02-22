import {
  evaluationRadioGroupContent,
  evaluationRadioGroupContentContainer,
  item,
  itemTitle,
  itemTitleIcon,
  itemTitleLabel,
} from "@/assets/css/EvaluationRadio.module.scss";
import withListMapper from "@/components/HOCs/withListMapper.tsx";
import { Icon } from "@/components/Icons/Icon.tsx";
import { EvaluationRadioItemDescription } from "@/components/Radio/EvaluationRadioItemDescription.tsx";
import type { EvaluationRadioItemProps } from "@/components/Radio/types/radio.types.ts";
import {
  Field,
  FieldContent,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field.tsx";
import { Label } from "@/components/ui/label.tsx";
import { RadioGroupItem } from "@/components/ui/radio-group.tsx";
import {
  debugLogs,
  evaluationRadioItemPropsInvalid,
} from "@/configs/app-components.config.ts";
import sanitizeDOMProps from "@/utils/props.ts";
import { cn, createComponentName } from "@/utils/utils.ts";
import { Activity, type ComponentType, type MouseEvent } from "react";

/**
 * Evaluation radio item component.
 *
 * @description Displays a radio item with its label and a count in description.
 *
 * @param id - Unique identifier for the radio item
 * @param name - Name of the radio item
 * @param subSkills - Map of sub-skills associated with the item
 * @param description - Description text for the item
 * @param props - Additional props for the item component
 *
 * @returns null if props are invalid, otherwise the rendered radio item component.
 */
function withEvaluationRadioItem<T extends object>(
  WrappedComponent: ComponentType<T>,
) {
  return function EvaluationRadioItem<C extends EvaluationRadioItemProps>(
    props: C & T,
  ) {
    const { id, name, itemClick, isCompleted, ...rest } = props;

    const safeProps = sanitizeDOMProps(rest, [
      "subSkills",
      "tasksList",
      "studentsToEvaluate",
      "isLinkedToTasks",
    ]);

    if (evaluationRadioItemPropsInvalid(props)) {
      debugLogs("EvaluationRadioItem", props);
      return null;
    }

    /**
     * Handles click event on the radio item.
     *
     * @description If an itemClick() handler is provided in props, it invokes that handler
     *
     * @param e - Mouse event object
     */
    const handleClick = (e: MouseEvent<HTMLLabelElement>) => {
      e.stopPropagation();
      itemClick?.(e, props);
    };

    const iconStyle = isCompleted
      ? {
          className: "hidden",
          "aria-hidden": true,
        }
      : {};

    return (
      <FieldLabel
        htmlFor={`r-${id}`}
        className={cn(evaluationRadioGroupContent, {
          "bg-gray-300": safeProps.isDisabled,
        })}
        onClick={handleClick}
        {...safeProps}
      >
        <Field className={evaluationRadioGroupContentContainer}>
          <FieldContent className={item}>
            <FieldTitle className={itemTitle}>
              <Activity mode={isCompleted ? "visible" : "hidden"}>
                <Icon iconPath="check" className={itemTitleIcon} />
              </Activity>
              <RadioGroupItem
                {...iconStyle}
                id={`r-${id}`}
                value={id}
                disabled={safeProps.isDisabled}
              />
              <Label className={itemTitleLabel} htmlFor={`r-${id}`}>
                {name}
              </Label>
            </FieldTitle>
            <WrappedComponent {...(props as T)} />
          </FieldContent>
        </Field>
      </FieldLabel>
    );
  };
}

/**
 * EvaluationRadioItem component wrapped with description.
 */
export const EvaluationRadioItemWithDescription = withEvaluationRadioItem(
  EvaluationRadioItemDescription,
);
createComponentName(
  "withEvaluationRadioItem",
  "EvaluationRadioItemWithDescription",
  EvaluationRadioItemWithDescription,
);

/**
 * List of EvaluationRadioItem components with description.
 */
export const EvaluationRadioItemList = withListMapper(
  EvaluationRadioItemWithDescription,
);
createComponentName(
  "withListMapper",
  "EvaluationRadioItemList",
  EvaluationRadioItemList,
);

/**
 * List of EvaluationRadioItem components without description.
 */
export const EvaluationRadioItemWithoutDescriptionList = withListMapper(
  withEvaluationRadioItem(() => null),
);
createComponentName(
  "withListMapper",
  "EvaluationRadioItemWithoutDescriptionList",
  EvaluationRadioItemWithoutDescriptionList,
);
