import type { useStepThreeState } from "@/features/evaluations/create/hooks/useStepThreeState";
import { useEffect, useEffectEvent, useState } from "react";

export type UseStepThreeProps = Readonly<{
  isModuleClicked: boolean;
  setShowStudentsEvaluation: ReturnType<
    typeof useStepThreeState
  >["setShowStudentsEvaluation"];
}>;

/**
 * Custom hook to manage the logic for Step Three of the evaluation creation process.
 *
 * @description This hook is responsible for handling the display of the students evaluation component based on module selection & dispatch the subSkill selection to the parent component through context
 *
 * @param subskillsControllerProps - The props for the sub-skills selection controller.
 * @param isModuleClicked - A boolean indicating whether a module has been clicked.
 */
export function useStepThree({
  isModuleClicked,
  setShowStudentsEvaluation,
}: UseStepThreeProps) {
  const [isModuleLoaded, setIsModuleLoaded] = useState(false);

  /**
   * DISPATCH - Reset view to module selection on unmount
   *
   * @description This makes sure the view is reset to module selection when coming back from students evaluation
   */
  const triggerViewResetToModules = useEffectEvent(() => {
    if (isModuleClicked) {
      setShowStudentsEvaluation(false);
    }
  });

  /**
   * INIT - Reset view to module selection
   *
   * @description Only once when exiting the view
   */
  useEffect(() => {
    // CLEANUP
    return () => {
      triggerViewResetToModules();
    };
  }, []);

  return {
    isModuleLoaded,
    setIsModuleLoaded,
  };
}
