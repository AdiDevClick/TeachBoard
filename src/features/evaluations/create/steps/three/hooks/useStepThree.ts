import type { useStepThreeState } from "@/features/evaluations/create/hooks/useStepThreeState";
import { HandleLeftContentChange } from "@/features/evaluations/create/steps/three/components/step-three-functionnal-wrappers.functions";
import type { StepThreeSubskillsSelectionControllerProps } from "@/features/evaluations/create/steps/three/types/step-three.types";
import {
  useEffect,
  useEffectEvent,
  type Dispatch,
  type JSX,
  type SetStateAction,
} from "react";
import { useOutletContext } from "react-router-dom";

export type UseStepThreeProps = {
  subskillsControllerProps: StepThreeSubskillsSelectionControllerProps;
  isModuleClicked: boolean;
  setShowStudentsEvaluation: ReturnType<
    typeof useStepThreeState
  >["setShowStudentsEvaluation"];
};

/**
 * Custom hook to manage the logic for Step Three of the evaluation creation process.
 *
 * @description This hook is responsible for handling the display of the students evaluation component based on module selection & dispatch the subSkill selection to the parent component through context
 *
 * @param subskillsControllerProps - The props for the sub-skills selection controller.
 * @param isModuleClicked - A boolean indicating whether a module has been clicked.
 */
export function useStepThree(props: UseStepThreeProps) {
  const [, setLeftContent] =
    useOutletContext<[JSX.Element, Dispatch<SetStateAction<JSX.Element>>]>();

  const {
    subskillsControllerProps,
    isModuleClicked,
    setShowStudentsEvaluation,
  } = props;
  /**
   * DISPATCH - Display students evaluation on module click
   *
   * @description This will update the context for left content on the parent component
   */
  const isModuleClickedTrigger = useEffectEvent(() => {
    if (!setLeftContent) return;

    const leftContent = HandleLeftContentChange(
      subskillsControllerProps,
      isModuleClicked,
    );

    setLeftContent(leftContent);
  });

  /**
   * CLEANUP - Reset left content
   *
   * @description This makes sure the subskills selection is empty on other pages than students evaluation
   */
  const onReturn = useEffectEvent(() => {
    setLeftContent(null!);
  });

  /**
   * DISPATCH -
   *
   * @description Each time a change occurs on module click
   */
  useEffect(() => {
    isModuleClickedTrigger();

    // CLEANUP
    return () => onReturn();
  }, [isModuleClicked]);

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
    return () => {
      triggerViewResetToModules();
    };
  }, []);
}
