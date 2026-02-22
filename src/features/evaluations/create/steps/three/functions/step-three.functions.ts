import { DescriptionChange } from "@/features/evaluations/create/steps/three/components/step-three-functionnal-wrappers.functions";
import {
  STEP_THREE_MODULE_SELECTION_CARD_PROPS,
  STEP_THREE_SUBSKILLS_SELECTION_CARD_PROPS,
  STEP_THREE_SUBSKILLS_SELECTION_TITLE_PROPS,
} from "@/features/evaluations/create/steps/three/config/step-three.configs";
import type { ClassModuleSubSkill } from "@/features/evaluations/create/store/types/steps-creation-store.types";
import { preventDefaultAndStopPropagation } from "@/utils/utils.ts";
import type { MouseEvent } from "react";

/**
 * Handle previous arrow click to go back to module selection
 *
 * @param e - Mouse event from the click
 * @param setter - Optional state setter to update module selection state
 */
export function handlePreviousClick(
  e: MouseEvent<SVGSVGElement>,
  displayEvaluations?: (_value: boolean) => void,
) {
  preventDefaultAndStopPropagation(e);
  displayEvaluations?.(false);
}

/**
 * Returns the appropriate card props based on whether a module has been clicked or not.
 *
 * @param selectedSubSkill - The currently selected sub-skill (to display its name in the title)
 * @param isModuleClicked - Whether a module has been clicked
 * @returns The card props to be used for the current view
 */
export function card(
  selectedSubSkill: ClassModuleSubSkill | null,
  isModuleClicked: boolean,
) {
  if (!isModuleClicked) {
    return STEP_THREE_MODULE_SELECTION_CARD_PROPS;
  }

  return {
    ...STEP_THREE_SUBSKILLS_SELECTION_CARD_PROPS,
    title: {
      ...STEP_THREE_SUBSKILLS_SELECTION_TITLE_PROPS,
      description: DescriptionChange(selectedSubSkill ?? {}),
    },
  };
}

/**
 * Defines the animation for the module card
 *
 * @param isModuleClicked - Whether a module has been clicked, which determines the animation direction
 * @param isModuleLoaded - Whether the module has finished loading, which determines the animation direction
 * @returns An object containing the style for the module card animation
 */
export const moduleCardAnimation = (
  isModuleClicked: boolean,
  isModuleLoaded: boolean,
) => {
  let animation;

  if (isModuleClicked) {
    animation = "step-three-module-out 0.5s both";
  } else if (isModuleLoaded) {
    animation = "step-three-module-in 0.5s both";
  }

  return { style: { animation } };
};
