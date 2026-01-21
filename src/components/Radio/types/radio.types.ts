import type { ClassModules } from "@/api/store/types/steps-creation-store.types.ts";
import type { UUID } from "@/api/types/openapi/common.types.ts";
import type { FieldLabel } from "@/components/ui/field.tsx";
import type { ComponentProps, MouseEvent } from "react";

/**
 * Validation requirements for RadioItem.
 */
export type EvaluationRadioItemProps = {
  id: UUID;
  name: string;
  subSkills: ClassModules["subSkills"];
  description?: string;
  itemClick?: (
    e: MouseEvent<HTMLLabelElement>,
    props: EvaluationRadioItemProps,
  ) => void;
} & ComponentProps<typeof FieldLabel>;

/**
 * Evaluation radio item description props.
 */
export type EvaluationRadioItemDescriptionProps = Readonly<{
  id: string;
  subSkills: ClassModules["subSkills"];
  description?: string;
}>;
