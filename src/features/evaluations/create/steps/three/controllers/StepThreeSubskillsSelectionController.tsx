import { EvaluationRadioItemWithoutDescriptionList } from "@/components/Radio/EvaluationRadioItem.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import { RadioGroup } from "@/components/ui/radio-group.tsx";
import {
  debugLogs,
  stepThreeSubskillsSelectionControllerPropsInvalid,
} from "@/configs/app-components.config.ts";
import { useStepThreeHandler } from "@/features/evaluations/create/hooks/useStepThreeHandler.ts";
import type { StepThreeSubskillsSelectionControllerProps } from "@/features/evaluations/create/steps/three/types/step-three.types.ts";
import { useEvaluationStepsCreationStore } from "@/features/evaluations/create/store/EvaluationStepsCreationStore.ts";
import { Activity, useEffect } from "react";
import { useShallow } from "zustand/shallow";

/**
 * Step Three Subskills Selection Controller.
 *
 * @remarks The logic for handling sub-skill selection is managed via the useEvaluationStepsCreationStore hook.
 *
 * @param formId - The ID of the form
 */
export function StepThreeSubskillsSelectionController(
  props: StepThreeSubskillsSelectionControllerProps,
) {
  const { formId } = props;

  const subSkills = useEvaluationStepsCreationStore(
    useShallow((state) => state.getSelectedModuleSubSkills()),
  );

  const {
    handleSubSkillChangeCallback,
    selectedSubSkillId,
    disableSubSkillsWithoutStudents,
    selectedModuleId,
    selectedSubSkill,
  } = useStepThreeHandler(subSkills);

  /**
   * INIT
   *
   * @description Disable sub-skills without students to evaluate upon initial render.
   */
  useEffect(() => {
    if (!selectedModuleId) {
      return;
    }

    disableSubSkillsWithoutStudents(selectedModuleId);
  }, []);

  /**
   * AUTO-SELECT FIRST SUB-SKILL
   *
   * @description - Auto-select the first sub-skill that is not disabled when a change happens on the sub-skills list.
   */
  useEffect(() => {
    if (!selectedModuleId || subSkills.length === 0) {
      return;
    }

    const firstActivableSubSkill = subSkills.find(
      (subSkill) => !subSkill.isDisabled,
    );

    const shouldSelectFirstEnabled =
      !selectedSubSkill?.id || selectedSubSkill?.isDisabled;

    if (shouldSelectFirstEnabled && firstActivableSubSkill?.id) {
      handleSubSkillChangeCallback(firstActivableSubSkill.id);
    }
  }, [selectedModuleId, selectedSubSkill?.isDisabled]);

  if (stepThreeSubskillsSelectionControllerPropsInvalid(props)) {
    debugLogs("StepThreeSubskillsSelectionController", props);
    return null;
  }

  const selectedId = selectedSubSkillId ?? subSkills[0]?.id;

  return (
    <form id={formId}>
      <Activity mode={subSkills.length === 0 ? "visible" : "hidden"}>
        <Badge variant="outline" className="p-4">
          Aucune sous-compétence disponible pour ce module.
        </Badge>
      </Activity>
      <Activity mode={subSkills.length > 0 ? "visible" : "hidden"}>
        <RadioGroup
          value={selectedId}
          onValueChange={handleSubSkillChangeCallback}
        >
          <EvaluationRadioItemWithoutDescriptionList items={subSkills} />
        </RadioGroup>
      </Activity>
    </form>
  );
}
