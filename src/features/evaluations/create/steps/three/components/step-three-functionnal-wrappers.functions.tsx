import type { DescriptionChangeProps } from "@/features/evaluations/create/steps/three/components/types/wrappers-functions.types";
import { STEP_THREE_SUBSKILLS_SELECTION_TITLE_PROPS } from "@/features/evaluations/create/steps/three/config/step-three.configs";
import { StepThreeSubskillsSelectionController } from "@/features/evaluations/create/steps/three/controllers/StepThreeSubskillsSelectionController";
import type { StepThreeSubskillsSelectionControllerProps } from "@/features/evaluations/create/steps/three/types/step-three.types";

/**
 * Handle left content change based on module selection state
 *
 * @param commonProps - Common props for Step Three components
 * @param isModuleClicked - Whether the module selection is clicked
 *
 * @returns The left content JSX element
 */
export function HandleLeftContentChange(
  commonProps: StepThreeSubskillsSelectionControllerProps,
  isModuleClicked: boolean,
) {
  if (isModuleClicked) {
    return <StepThreeSubskillsSelectionController {...commonProps} />;
  }

  return null!;
}

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
