import type { DescriptionChangeProps } from "@/features/evaluations/create/steps/three/components/types/wrappers-functions.types";
import { STEP_THREE_SUBSKILLS_SELECTION_TITLE_PROPS } from "@/features/evaluations/create/steps/three/config/step-three.configs";

/**
 * Change description based on selected sub-skill
 *
 * @param selectedSubSkill - The currently selected sub-skill.
 * @returns A JSX element representing the description.
 */
export function DescriptionChange(selectedSubSkill: DescriptionChangeProps) {
  const { name } = selectedSubSkill || {};

  // if (name) {
  //   return <Badge>{name}</Badge>;
  // }

  return name ?? STEP_THREE_SUBSKILLS_SELECTION_TITLE_PROPS.description;
}
