import type {
  ControlledCriteriaInput,
  ControlledTextArea,
} from "@/features/class-creation/components/DegreeModuleSkill/exports/degree-module-skill-justification.exports";
import type { DegreeModuleSkillFormSchema } from "@/features/class-creation/components/DegreeModuleSkill/models/degree-module-skill.model";
import type { ComponentProps } from "react";
import type { useFieldArray, UseFormReturn } from "react-hook-form";

/**
 * Props for the ScoreCriteria component
 */
export type ScoreCriteriaProps = Readonly<{
  /** The name of the criteria, used as a prefix for form fields */
  name: `criterias.${number}`;
  /** The form instance, to retrieve control and values */
  form: UseFormReturn<DegreeModuleSkillFormSchema>;
  /** The index from the field array */
  index: number;
  /** A function to remove this criteria */
  remove: ReturnType<typeof useFieldArray>["remove"];
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
