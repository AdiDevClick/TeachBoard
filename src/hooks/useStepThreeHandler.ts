import { useEvaluationStepsCreationStore } from "@/api/store/EvaluationStepsCreationStore.ts";
import type { UUID } from "@/api/types/openapi/common.types.ts";
import type { EvaluationRadioItemProps } from "@/components/Radio/types/radio.types.ts";
import { useCallback, useState, type MouseEvent } from "react";
import { useShallow } from "zustand/shallow";
export type UseStepThreeHandlerProps =
  | ReturnType<
      (typeof useEvaluationStepsCreationStore)["getState"]
    >["getAttendedModules"]
  | ReturnType<
      (typeof useEvaluationStepsCreationStore)["getState"]
    >["moduleSelection"]["selectedModuleSubSkills"];

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
    (state) => state.moduleSelection.selectedModule?.id ?? null,
  );

  const selectedSubSkillId = useEvaluationStepsCreationStore(
    (state) => state.subSkillSelection.selectedSubSkill?.id ?? null,
  );

  const isThisSubSkillCompleted = useEvaluationStepsCreationStore(
    useShallow((state) => state.isThisSubSkillCompleted),
  );

  const [isCompleted, setIsCompleted] = useState<boolean>(false);

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

      const isCompleted = isThisSubSkillCompleted();
      setIsCompleted(isCompleted);

      if (!selectedModule?.item) {
        return;
      }

      setModuleSelection({
        isClicked: true,
        selectedModuleIndex: selectedModule.index,
        selectedModule: selectedModule.item,
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

      // const isCompleted = isThisSubSkillCompleted();
      // console.log(isCompleted);

      if (!selectedSubSkill?.item) {
        return;
      }

      setSubskillSelection({
        isClicked: true,
        selectedSubSkillIndex: selectedSubSkill.index,
        selectedSubSkill: selectedSubSkill.item,
        // isCompleted,
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
    if (!selectedModuleId || props.id !== selectedModuleId) {
      return;
    }

    const selectedModuleIndex = props.index;
    const selectedModule = modulesOrSubSkills[selectedModuleIndex];

    if (!selectedModule) {
      return;
    }

    setModuleSelection({
      isClicked: true,
      selectedModuleIndex,
      selectedModule: selectedModule,
    });
  };
  return {
    handleModuleChangeCallback,
    handleSubSkillChangeCallback,
    handleSameModuleSelectionClickCallback,
    selectedModuleId,
    selectedSubSkillId,
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
