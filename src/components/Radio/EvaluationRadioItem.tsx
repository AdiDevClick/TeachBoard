import withListMapper from "@/components/HOCs/withListMapper.tsx";
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

import "@css/EvaluationRadio.scss";
import { type ComponentType, type MouseEvent } from "react";

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
    const { id, name, itemClick, ...rest } = props;

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

    return (
      <FieldLabel
        htmlFor={`r-${id}`}
        className="evaluation-radio-item"
        onClick={handleClick}
        {...rest}
      >
        <Field className="evaluation-radio-item--container">
          <FieldContent className="evaluation-radio-item__content">
            <FieldTitle className="evaluation-radio-item__content--title">
              <RadioGroupItem id={`r-${id}`} value={id} />
              <Label
                className="evaluation-radio-item__content--title__label"
                htmlFor={`r-${id}`}
              >
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

/**
 * List of EvaluationRadioItem components with description.
 */
export const EvaluationRadioItemList = withListMapper(
  EvaluationRadioItemWithDescription,
);

/**
 * List of EvaluationRadioItem components without description.
 */
export const EvaluationRadioItemWithoutDescriptionList = withListMapper(
  withEvaluationRadioItem(() => null),
);
