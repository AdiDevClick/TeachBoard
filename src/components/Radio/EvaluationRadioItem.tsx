import withListMapper from "@/components/HOCs/withListMapper.tsx";
import type { EvaluationRadioItemProps } from "@/components/Radio/types/radio.types.ts";
import { Badge } from "@/components/ui/badge.tsx";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item.tsx";
import { Label } from "@/components/ui/label.tsx";
import { RadioGroupItem } from "@/components/ui/radio-group.tsx";
import {
  debugLogs,
  evaluationRadioItemPropsInvalid,
} from "@/configs/app-components.config.ts";
import { preventDefaultAndStopPropagation } from "@/utils/utils.ts";
import "@css/EvaluationRadio.scss";
import type { MouseEvent } from "react";

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
export function EvaluationRadioItem(props: EvaluationRadioItemProps) {
  const {
    id,
    name,
    subSkills,
    description = "Sous-compétences",
    itemClick,
    ...rest
  } = props;

  if (evaluationRadioItemPropsInvalid(props)) {
    debugLogs("EvaluationRadioItem");
    return null;
  }

  /**
   * Handles click event on the radio item.
   *
   * @description If an itemClick() handler is provided in props, it invokes that handler
   *
   * @param e - Mouse event object
   */
  const handleClick = (e: MouseEvent<HTMLDivElement>) => {
    preventDefaultAndStopPropagation(e);
    itemClick?.(e, props);
  };

  return (
    <Item
      key={id}
      variant="outline"
      className="evaluation-radio-item--container"
      onClick={handleClick}
      {...rest}
    >
      <ItemContent className="evaluation-radio-item__content">
        <ItemTitle className="evaluation-radio-item__content--title">
          <RadioGroupItem id={`r-${id}`} value={name} />
          <Label
            className="evaluation-radio-item__content--title__label"
            htmlFor={`r-${id}`}
          >
            {name}
          </Label>
        </ItemTitle>
        <ItemDescription className="evaluation-radio-item__content--description">
          <Badge variant="destructive" className="destructive-badge">
            {subSkills?.size ?? 0}
          </Badge>
          <Label
            className="evaluation-radio-item__content--description__label"
            htmlFor={`r-${id}`}
          >
            {description}
          </Label>
        </ItemDescription>
      </ItemContent>
    </Item>
  );
}

export const EvaluationRadioItemList = withListMapper(EvaluationRadioItem);
