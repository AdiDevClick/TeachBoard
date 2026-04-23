import { ItemGroup } from "@/components/ui/item";
import type { ScoreCriteriaProps } from "@/features/class-creation/components/DegreeModuleSkill/components/scores/types/score-criteria.types";
import {
  ControlledCriteriaInput,
  ControlledTextArea,
} from "@/features/class-creation/components/DegreeModuleSkill/exports/degree-module-skill-justification.exports";

/**
 * Component for rendering a single score criteria with its description.
 *
 * @description Use this component within a dynamic field array to allow users to add multiple criteria for different score thresholds when justifying degree skills.
 *
 * @param form - The react-hook-form instance to manage form state and control.
 * @param index - The index of this criteria in the field array, used for naming form fields.
 * @param remove - A function to remove this criteria from the field array.
 * @param scoreProps - Props to pass to the score input component, excluding name and control which are managed internally.
 * @param descriptionProps - Props to pass to the description input component, excluding name and control which are managed internally.
 * @param name - The base name for this criteria, used to construct the full field names for score and description.
 */
export function ScoreCriteria({
  form,
  index,
  remove,
  scoreProps,
  descriptionProps,
  name,
}: ScoreCriteriaProps) {
  const scoreName = `${name}.score`;
  const descriptionName = `${name}.description`;
  const scoreValue = form.watch(scoreName);

  return (
    <ItemGroup className="gap-3 rounded-md border border-border/60 p-3">
      <ControlledCriteriaInput
        {...scoreProps}
        name={scoreName}
        control={form.control}
        index={index}
        remove={remove}
      />
      <ControlledTextArea
        {...descriptionProps}
        name={descriptionName}
        control={form.control}
        rows={3}
        aria-label={`Critère pour la note ${scoreValue ?? 0}/100`}
      />
    </ItemGroup>
  );
}
