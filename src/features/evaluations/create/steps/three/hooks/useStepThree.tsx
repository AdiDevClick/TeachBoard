import type { ClassSummaryDto } from "@/api/types/routes/classes.types";
import type { useStepThreeState } from "@/features/evaluations/create/hooks/useStepThreeState";
import { useEffect, useEffectEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export type UseStepThreeProps = Readonly<{
  isModuleClicked: boolean;
  selectedClass?: ClassSummaryDto | null;
}> &
  Pick<
    ReturnType<typeof useStepThreeState>,
    "setShowStudentsEvaluation" | "getAttendedModules"
  >;

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
  selectedClass,
  setShowStudentsEvaluation,
  getAttendedModules,
}: UseStepThreeProps) {
  const [isModuleLoaded, setIsModuleLoaded] = useState(false);
  const navigate = useNavigate();

  /**
   * INIT - REDIRECT IF NO CLASS
   *
   * @description If no class was selected before, redirect the user to the first step to select a class before creating attendance records.
   */
  const redirectToStepOneIfNoClassSelected = useEffectEvent(() => {
    if (!selectedClass || getAttendedModules().length === 0) {
      toast.error(
        "Veuillez sélectionner une classe avant de créer des évaluations ou assurez-vous de la présence de modules à évaluer.",
      );
      navigate("/evaluations/create");
    }
  });

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
   * @description Only once when entering/exiting the view
   */
  useEffect(() => {
    redirectToStepOneIfNoClassSelected();
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
