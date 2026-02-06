import { Badge } from "@/components/ui/badge";
import { ShowStudentsEvaluation } from "@/features/evaluations/create/steps/three/components/step-three-wrappers.functions";
import {
  STEP_THREE_SUBSKILLS_SELECTION_CARD_PROPS,
  STEP_THREE_SUBSKILLS_SELECTION_TITLE_PROPS,
} from "@/features/evaluations/create/steps/three/config/step-three.configs";
import { StepThreeSubskillsSelectionController } from "@/features/evaluations/create/steps/three/controllers/StepThreeSubskillsSelectionController";
import { handlePreviousClick } from "@/features/evaluations/create/steps/three/functions/step-three.functions";
import type {
  ShowStudentsEvaluationWithPreviousArrowProps,
  StepThreeSubskillsSelectionControllerProps,
} from "@/features/evaluations/create/steps/three/types/step-three.types";
import { IconArrowAutofitLeft } from "@tabler/icons-react";

export function ShowStudentsEvaluationWithPreviousArrow(
  props: ShowStudentsEvaluationWithPreviousArrowProps,
) {
  const { onPreviousArrowClick: displayModules, ...commonProps } = props;

  return (
    <>
      <IconArrowAutofitLeft
        className={
          STEP_THREE_SUBSKILLS_SELECTION_CARD_PROPS.arrowBack.className
        }
        onClick={(e) => handlePreviousClick(e, displayModules)}
        data-name="modules-previous"
      />
      <ShowStudentsEvaluation {...commonProps} />
    </>
  );
}

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
export function DescriptionChange(selectedSubSkill?: { name?: string } | null) {
  const { name } = selectedSubSkill || {};

  if (name) {
    return <Badge>{name}</Badge>;
  }

  return STEP_THREE_SUBSKILLS_SELECTION_TITLE_PROPS.description;
}
