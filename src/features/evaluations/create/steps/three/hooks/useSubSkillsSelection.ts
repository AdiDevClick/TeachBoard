import type { UseStepThreeHandlerProps } from "@/features/evaluations/create/steps/three/types/step-three.types";
import { useStepThreeHandler } from "@/hooks/useStepThreeHandler";
import { useEffect, useEffectEvent } from "react";

/**
 * Hook to manage sub-skills selection logic in Step Three of the evaluation creation process.
 *
 * @description This uses useStepThreeHandler()
 *
 * @param subSkills - The list of sub-skills available for selection, passed to the useStepThreeHandler hook.
 * @returns - The selected sub-skill ID and the callback to handle sub-skill changes.
 */
export function useSubSkillsSelection(subSkills: UseStepThreeHandlerProps) {
  const {
    handleSubSkillChangeCallback,
    selectedSubSkillId,
    disableSubSkillsWithoutStudents,
    selectedModuleId,
    selectedSubSkill,
  } = useStepThreeHandler(subSkills);

  /**
   * INIT - Initial logic for sub-skills selection.
   *
   * @description Disables sub-skills without students to evaluate upon initial render.
   */
  const triggerInit = useEffectEvent(() => {
    if (!selectedModuleId) {
      return;
    }
    disableSubSkillsWithoutStudents(selectedModuleId);
  });

  /**
   * INIT -
   *
   * @description When any module is selected
   */
  useEffect(() => {
    triggerInit();
  }, [selectedModuleId]);

  /**
   * AUTO-SELECT - FIRST SUB-SKILL
   *
   * @description Auto-select the first sub-skill that is not disabled when a change happens on the sub-skills list.
   */
  const onModuleChangeAutoSelectFirstSubSkill = useEffectEvent(() => {
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
  });

  /**
   * AUTO-SELECT - FIRST SUB-SKILL
   *
   * @description - Each time a module changes
   */
  useEffect(() => {
    onModuleChangeAutoSelectFirstSubSkill();
  }, [selectedModuleId, selectedSubSkill?.isDisabled]);

  return {
    selectedSubSkillId,
    handleSubSkillChangeCallback,
  };
}
