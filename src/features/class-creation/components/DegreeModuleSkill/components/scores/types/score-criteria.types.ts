import type {
  ControlledCriteriaInput,
  ControlledTextArea,
} from "@/features/class-creation/components/DegreeModuleSkill/exports/degree-module-skill-justification.exports";
import type { ComponentProps } from "react";
import type {
  FieldValues,
  UseFieldArrayRemove,
  UseFormReturn,
} from "react-hook-form";

/**
 * Props for the ScoreCriteria component
 */
export type ScoreCriteriaProps<
  TField extends FieldValues = FieldValues,
  TName extends string = string,
> = Readonly<{
  /** The name of the criteria, used as a prefix for form fields */
  name: TName;
  /** The form instance, to retrieve control and values */
  form: UseFormReturn<TField>;
  /** The index from the field array */
  index: number;
  /** A function to remove this criteria */
  remove: UseFieldArrayRemove;
  /** Props for the score input */
  scoreProps: Omit<
    ComponentProps<typeof ControlledCriteriaInput>,
    "name" | "control" | "index" | "remove" | "value"
  >;
  /** Props for the description input */
  descriptionProps: Omit<
    ComponentProps<typeof ControlledTextArea>,
    "name" | "control"
  >;
}>;
