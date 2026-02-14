import { useSidebar } from "@/components/ui/sidebar";
import type { TriggerButtonInteractivityArgs } from "@/features/evaluations/create/components/Tabs/types/tabs.types";
import type { UseTabContentHandlerProps } from "@/features/evaluations/create/hooks/types/use-tab-content-handler.types";
import { useStepThreeState } from "@/features/evaluations/create/hooks/useStepThreeState";
import { useEffect, useEffectEvent, useState, type MouseEvent } from "react";

/**
 * Custom hook to handle tab content interactions in the evaluation creation process.
 *
 * @param props - The properties required to manage the tab content interactions, including the tab name, click properties, onClick handler, and index.
 */
export function useTabContentHandler({
  name: tabName,
  clickProps,
  onClick: onClickHandler,
  index,
}: UseTabContentHandlerProps) {
  const {
    areAllModulesCompleted,
    selectedClass,
    modules,
    setShowStudentsEvaluation,
    moduleSelectionState,
  } = useStepThreeState();

  const { isMobile, setOpen, open } = useSidebar();
  const [disableNext, setDisableNext] = useState(true);

  /**
   * BUTTONS INTERACTIVITY - CHECKER
   *
   * @description Cchecks the conditions to enable or disable the next button based on the current tab and the state of the evaluation creation process.
   */
  const triggerButtonInteractivity = useEffectEvent(
    (args: TriggerButtonInteractivityArgs) => {
      const {
        tabName,
        selectedClass,
        modules,
        areAllModulesCompleted,
        moduleSelectionState,
      } = args;

      switch (tabName) {
        case "Classe":
          if (selectedClass?.id) {
            setDisableNext(false);
          }
          return;
        case "Elèves":
          if (modules.length > 0) {
            setDisableNext(false);
          }
          return;
        case "Evaluation":
          if (!areAllModulesCompleted && !moduleSelectionState.isClicked) {
            setDisableNext(true);
            return;
          }
          setDisableNext(false);
          return;
        default:
          setDisableNext(true);
      }
    },
  );

  /**
   * BUTTONS INTERACTIVITY - INIT & UPDATE
   *
   * @description Each time one of the dependencies change
   */
  useEffect(() => {
    triggerButtonInteractivity({
      tabName,
      selectedClass: selectedClass ?? undefined,
      modules,
      areAllModulesCompleted,
      moduleSelectionState,
    });
  }, [
    tabName,
    selectedClass,
    modules,
    areAllModulesCompleted,
    moduleSelectionState,
  ]);

  /**
   * BUTTONS INTERACTIVITY - HANDLER
   *
   * @description The data-set is read to identify which button is clicked (previous or next).
   *
   * @param e - The event to check
   */
  const clickHandler = (e: MouseEvent<HTMLButtonElement>) => {
    const currentStep = e.currentTarget.dataset.name;

    if (
      tabName === "Evaluation" &&
      currentStep === "next-step" &&
      moduleSelectionState.isClicked &&
      !areAllModulesCompleted
    ) {
      setShowStudentsEvaluation(false);
      return;
    }

    onClickHandler({ e, ...clickProps, index, setOpen, open });
  };

  return {
    clickHandler,
    disableNext,
    isMobile,
  };
}
