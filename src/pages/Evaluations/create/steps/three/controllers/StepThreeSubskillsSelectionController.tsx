import { EvaluationRadioItemWithoutDescriptionList } from "@/components/Radio/EvaluationRadioItem.tsx";
import { RadioGroup } from "@/components/ui/radio-group.tsx";
import {
  debugLogs,
  stepThreeSubskillsSelectionControllerPropsInvalid,
} from "@/configs/app-components.config.ts";
import { useStepThreeHandler } from "@/hooks/useStepThreeHandler.ts";
import type { StepThreeSubskillsSelectionControllerProps } from "@/pages/Evaluations/create/steps/three/types/step-three.types.ts";

/**
 * Step Three Subskills Selection Controller.
 *
 * @remarks The logic for handling sub-skill selection is managed via the useEvaluationStepsCreationStore hook.
 *
 * @param formId - The ID of the form
 * @param subSkills - List of sub-skills available for selection
 */
export function StepThreeSubskillsSelectionController(
  props: StepThreeSubskillsSelectionControllerProps,
) {
  const { formId, subSkills } = props;

  const { handleSubSkillChangeCallback, selectedSubSkillId } =
    useStepThreeHandler(subSkills);

  if (stepThreeSubskillsSelectionControllerPropsInvalid(props)) {
    debugLogs("StepThreeSubskillsSelectionController", props);
    return null;
  }

  return (
    <form id={formId}>
      <RadioGroup
        value={selectedSubSkillId ?? ""}
        defaultValue={subSkills[0]?.id ?? ""}
        onValueChange={handleSubSkillChangeCallback}
      >
        <EvaluationRadioItemWithoutDescriptionList items={subSkills} />
      </RadioGroup>
    </form>
  );
}
