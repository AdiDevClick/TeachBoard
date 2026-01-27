import { useEvaluationStepsCreationStore } from "@/api/store/EvaluationStepsCreationStore.ts";
import { EvaluationRadioItemWithoutDescriptionList } from "@/components/Radio/EvaluationRadioItem.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import { RadioGroup } from "@/components/ui/radio-group.tsx";
import {
  debugLogs,
  stepThreeSubskillsSelectionControllerPropsInvalid,
} from "@/configs/app-components.config.ts";
import { useStepThreeHandler } from "@/hooks/useStepThreeHandler.ts";
import type { StepThreeSubskillsSelectionControllerProps } from "@/pages/Evaluations/create/steps/three/types/step-three.types.ts";
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
  } = useStepThreeHandler(subSkills);

  /**
   * Init
   *
   * @description - Auto-select the first sub-skill if none is selected on initial render
   */
  useEffect(() => {
    if (!selectedModuleId || subSkills.length === 0) {
      return;
    }

    // Disable sub-skill if no students are to be evaluated
    disableSubSkillsWithoutStudents(selectedModuleId);

    // Auto-select the first sub-skill if none is selected or it no longer exists
    const firstSubSkillId = subSkills[0]?.id;
    const hasSelectedSubSkill = subSkills.some(
      (subSkill) => subSkill.id === selectedSubSkillId,
    );

    if ((!selectedSubSkillId || !hasSelectedSubSkill) && firstSubSkillId) {
      handleSubSkillChangeCallback(firstSubSkillId);
    }
  }, []);

  const selectedId = selectedSubSkillId ?? subSkills[0]?.id ?? "";

  if (stepThreeSubskillsSelectionControllerPropsInvalid(props)) {
    debugLogs("StepThreeSubskillsSelectionController", props);
    return null;
  }

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
          defaultValue={subSkills[0]?.id ?? ""}
          onValueChange={handleSubSkillChangeCallback}
        >
          <EvaluationRadioItemWithoutDescriptionList items={subSkills} />
        </RadioGroup>
      </Activity>
    </form>
  );
}
