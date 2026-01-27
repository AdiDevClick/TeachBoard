import { useEvaluationStepsCreationStore } from "@/api/store/EvaluationStepsCreationStore.ts";
import type {
  ClassModuleSubSkill,
  SelectedClassModulesReturn,
} from "@/api/store/types/steps-creation-store.types.ts";
import type { UUID } from "@/api/types/openapi/common.types.ts";
import type { EvaluationRadioItemProps } from "@/components/Radio/types/radio.types.ts";
import { useCallback, type MouseEvent } from "react";
import { useShallow } from "zustand/shallow";
export type UseStepThreeHandlerProps =
  | SelectedClassModulesReturn
  | ClassModuleSubSkill[];

/**
 * Hook to handle Step Three logic for module and sub-skill selection.
 *
 * @param modulesOrSubSkills - List of modules or sub-skills available for selection
 * @returns Handlers and selected IDs for module and sub-skill selection
 */
export function useStepThreeHandler(
  modulesOrSubSkills: UseStepThreeHandlerProps,
) {
  const setModuleSelection = useEvaluationStepsCreationStore(
    (state) => state.setModuleSelection,
  );
  const setSubskillSelection = useEvaluationStepsCreationStore(
    (state) => state.setSubskillSelection,
  );

  const selectedModuleId = useEvaluationStepsCreationStore(
    (state) => state.moduleSelection.selectedModuleId ?? null,
  );

  const selectedSubSkillId = useEvaluationStepsCreationStore(
    (state) => state.subSkillSelection.selectedSubSkillId ?? null,
  );

  const isThisSubSkillCompleted = useEvaluationStepsCreationStore(
    useShallow((state) => state.isThisSubSkillCompleted),
  );

  const disableSubSkillsWithoutStudents = useEvaluationStepsCreationStore(
    useShallow((state) => state.disableSubSkillsWithoutStudents),
  );

  /**
   * Handles the change of selected module.
   *
   * @remarks This is a controlled component
   * @description To avoid an event propagation issue, we directly handle the value change here.
   *
   * @param value - The UUID of the selected module
   */
  const handleModuleChangeCallback = useCallback(
    (value: UUID) => {
      if (!value) {
        return;
      }

      const selectedModule = findIndexById(value, modulesOrSubSkills);

      if (!selectedModule?.item) {
        return;
      }

      setModuleSelection({
        isClicked: true,
        selectedModuleIndex: selectedModule.index,
        selectedModuleId: selectedModule.item.id,
      });
    },
    [modulesOrSubSkills],
  );
  /**
   * Handles the change of selected sub-skill.
   *
   * @remarks This is a controlled component
   *
   * @description To avoid an event propagation issue, we directly handle the value change here.
   *
   * @param value - The UUID of the selected sub-skill
   */
  const handleSubSkillChangeCallback = useCallback(
    (value: UUID) => {
      if (!value) {
        return;
      }

      const selectedSubSkill = findIndexById(value, modulesOrSubSkills);

      if (!selectedSubSkill?.item) {
        return;
      }
      isThisSubSkillCompleted(selectedSubSkill.item.id);

      setSubskillSelection({
        isClicked: true,
        selectedSubSkillIndex: selectedSubSkill.index,
        selectedSubSkillId: selectedSubSkill.item.id,
      });
    },
    [modulesOrSubSkills],
  );
  /**
   * Handles the click on the already selected module.
   *
   * @param _e - MouseEvent<HTMLLabelElement>
   * @param props - EvaluationRadioItemProps
   * @returns
   */
  const handleSameModuleSelectionClickCallback = (
    _e: MouseEvent<HTMLLabelElement>,
    props: EvaluationRadioItemProps,
  ) => {
    const { id, index } = props;

    if (!selectedModuleId || id !== selectedModuleId || index == null) {
      return;
    }

    const selectedModule = modulesOrSubSkills[index];

    if (!selectedModule) {
      return;
    }

    setModuleSelection({
      isClicked: true,
      selectedModuleIndex: index,
      selectedModuleId: selectedModule.id,
    });
  };
  return {
    handleModuleChangeCallback,
    handleSubSkillChangeCallback,
    handleSameModuleSelectionClickCallback,
    selectedModuleId,
    selectedSubSkillId,
    disableSubSkillsWithoutStudents,
  };
}

/**
 * Finds the index of a module or sub-skill by its ID.
 *
 * @param id - The UUID to find
 * @param modulesOrSubSkills - The list of modules or sub-skills
 * @returns The index and item if found, otherwise null
 */
function findIndexById(id: UUID, modulesOrSubSkills: UseStepThreeHandlerProps) {
  const modulesOrSubSkillsList = Array.isArray(modulesOrSubSkills)
    ? modulesOrSubSkills
    : [modulesOrSubSkills];

  const selectedIndex = modulesOrSubSkillsList.findIndex(
    (module) => module?.id === id,
  );

  if (selectedIndex < 0) {
    return null;
  }

  return { index: selectedIndex, item: modulesOrSubSkillsList[selectedIndex] };
}
