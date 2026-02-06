import {
  itemDescription,
  itemDescriptionDestructiveBadge,
  itemDescriptionLabel,
} from "@/assets/css/EvaluationRadio.module.scss";
import type { EvaluationRadioItemDescriptionProps } from "@/components/Radio/types/radio.types.ts";
import { Badge } from "@/components/ui/badge.tsx";
import { FieldDescription } from "@/components/ui/field.tsx";
import { Label } from "@/components/ui/label.tsx";
import {
  debugLogs,
  evaluationRadioItemDescriptionPropsInvalid,
} from "@/configs/app-components.config.ts";

/**
 * Evaluation radio item description component.
 *
 * @description Displays the description and sub-skills count for an evaluation radio item.
 *
 * @param id - Unique identifier for the radio item
 * @param subSkills - Map of sub-skills associated with the item
 * @param description - Description text for the item
 */
export function EvaluationRadioItemDescription(
  props: EvaluationRadioItemDescriptionProps,
) {
  if (evaluationRadioItemDescriptionPropsInvalid(props)) {
    debugLogs("EvaluationRadioItemDescription", props);
    return null;
  }

  const { id, subSkills, description = "Sous-compétences" } = props;

  return (
    <FieldDescription className={itemDescription}>
      <Badge variant="destructive" className={itemDescriptionDestructiveBadge}>
        {subSkills.size ?? 0}
      </Badge>
      <Label className={itemDescriptionLabel} htmlFor={`r-${id}`}>
        {description}
      </Label>
    </FieldDescription>
  );
}
