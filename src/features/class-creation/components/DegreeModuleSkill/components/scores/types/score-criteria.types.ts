import type {
  ControlledCriteriaInput,
  ControlledTextArea,
} from "@/features/class-creation/components/DegreeModuleSkill/exports/degree-module-skill-justification.exports";
import type { ComponentProps } from "react";
import type {
  Control,
  FieldValues,
  UseFieldArrayRemove,
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
  /** The control instance, to manage form fields */
  control: Control<TField>;
  /** The index from the field array */
  index: number;
  /** A function to remove this criteria */
  remove: UseFieldArrayRemove;
  /** Props for the score input */
  scoreProps: Omit<
    ComponentProps<typeof ControlledCriteriaInput>,
    "name" | "control" | "index" | "remove" | "value"
  >;
  /** Props for the criterion input */
  criterionProps: Omit<
    ComponentProps<typeof ControlledTextArea>,
    "name" | "control"
  >;
}>;
