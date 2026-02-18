import { useSidebar } from "@/components/ui/sidebar";
import type { TriggerButtonInteractivityArgs } from "@/features/evaluations/create/components/Tabs/types/tabs.types";
import { useTabContentState } from "@/features/evaluations/create/hooks/tab-handler/useTabContentState";
import type {
  TabContentHandlerState,
  UseTabContentHandlerProps,
} from "@/features/evaluations/create/hooks/types/use-tab-content-handler.types";
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
    selectedClass,
    areAllModulesCompleted,
    moduleSelectionState,
    setShowStudentsEvaluation,
    areStudentsWithAssignedTask,
  } = useTabContentState();

  const { isMobile, setOpen, open } = useSidebar();
  const [tabState, setTabState] = useState<TabContentHandlerState>({
    isNextDisabled: true,
    leavingDirection: null,
    tabName,
  });

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
        areAllModulesCompleted,
        moduleSelectionState,
        areStudentsWithAssignedTask,
      } = args;

      let disabled = true;

      switch (tabName) {
        case "Classe":
          if (selectedClass?.id) {
            disabled = false;
          }
          break;
        case "Elèves":
          if (areStudentsWithAssignedTask) {
            disabled = false;
          }
          break;
        case "Evaluation":
          if (!areAllModulesCompleted && !moduleSelectionState.isClicked) {
            disabled = true;
            break;
          }
          disabled = false;
          break;
        default:
          disabled = true;
          break;
      }

      setTabState((prev) => ({
        ...prev,
        isNextDisabled: disabled,
        tabName,
      }));
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
      areAllModulesCompleted,
      moduleSelectionState,
      areStudentsWithAssignedTask,
    });
  }, [
    tabName,
    selectedClass,
    areAllModulesCompleted,
    moduleSelectionState,
    areStudentsWithAssignedTask,
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

    onClickHandler({ e, ...clickProps, index, setOpen, open, setTabState });
  };

  console.log("called the tabcontent handler");

  return {
    clickHandler,
    tabState,
    setTabState,
    isMobile,
  };
}
