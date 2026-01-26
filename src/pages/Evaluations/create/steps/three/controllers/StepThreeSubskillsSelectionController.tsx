import { useEvaluationStepsCreationStore } from "@/api/store/EvaluationStepsCreationStore.ts";
import { EvaluationRadioItemWithoutDescriptionList } from "@/components/Radio/EvaluationRadioItem.tsx";
import { RadioGroup } from "@/components/ui/radio-group.tsx";
import {
  debugLogs,
  stepThreeSubskillsSelectionControllerPropsInvalid,
} from "@/configs/app-components.config.ts";
import { useStepThreeHandler } from "@/hooks/useStepThreeHandler.ts";
import type { StepThreeSubskillsSelectionControllerProps } from "@/pages/Evaluations/create/steps/three/types/step-three.types.ts";
import { useEffect, useMemo } from "react";

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
  const isThisSubSkillCompleted = useEvaluationStepsCreationStore(
    (state) => state.isThisSubSkillCompleted,
  );
  const selectedModuleId = useEvaluationStepsCreationStore(
    (state) => state.moduleSelection.selectedModule?.id ?? null,
  );

  /**
   * Auto-select the first sub-skill if none is selected on initial render.
   */
  useEffect(() => {
    const firstSubSkillId = subSkills[0]?.id;

    if (!selectedSubSkillId && firstSubSkillId) {
      handleSubSkillChangeCallback(firstSubSkillId);
    }
  }, []);

  const selectedId = selectedSubSkillId ?? subSkills[0]?.id ?? "";
  const subSkillsWithCompletion = useMemo(
    () =>
      subSkills.map((subSkill) => ({
        ...subSkill,
        isCompleted: isThisSubSkillCompleted(
          subSkill.id,
          selectedModuleId ?? undefined,
        ),
        isSelected: subSkill.id === selectedId,
      })),
    [isThisSubSkillCompleted, selectedId, selectedModuleId, subSkills],
  );

  if (stepThreeSubskillsSelectionControllerPropsInvalid(props)) {
    debugLogs("StepThreeSubskillsSelectionController", props);
    return null;
  }

  return (
    <form id={formId}>
      <RadioGroup
        value={selectedId}
        defaultValue={subSkills[0]?.id ?? ""}
        onValueChange={handleSubSkillChangeCallback}
      >
        <EvaluationRadioItemWithoutDescriptionList
          items={subSkillsWithCompletion}
        />
      </RadioGroup>
    </form>
  );
}
