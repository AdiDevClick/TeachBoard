import {
  contentSeparator,
  evaluationPageContainer,
} from "@/assets/css/EvaluationPage.module.scss";
import { TAB_CONTENT_VIEW_CARD_PROPS } from "@/components/Tabs/config/tab-content.configs";
import type {
  LeftSideProps,
  TabContentProps,
  TriggerButtonInteractivityArgs,
} from "@/components/Tabs/types/tabs.types";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useSidebar } from "@/components/ui/sidebar";
import { TabsContent } from "@/components/ui/tabs";
import { useEvaluationStepsCreationStore } from "@/features/evaluations/create/store/EvaluationStepsCreationStore";
import { LeftSidePageContent } from "@/pages/Evaluations/create/left-content/LeftSidePageContent";
import withTitledCard from "@components/HOCs/withTitledCard.tsx";
import { IconArrowLeft, IconArrowRightDashed } from "@tabler/icons-react";
import { useEffect, useEffectEvent, useState, type MouseEvent } from "react";
import { useShallow } from "zustand/shallow";

/**
 * Tab content component for evaluation creation page.
 *
 * @param index - Index of the current tab
 * @param name - Name of the tab
 * @param leftSide - Data for the left side content
 * @param children - Right side content component
 * @param props - Additional props including onClick handler and clickProps
 */
export function TabContent(props: TabContentProps) {
  const {
    index,
    leftContent,
    name: tabName,
    leftSide,
    onClick: onClickHandler,
    clickProps,
  } = props;

  const areAllModulesCompleted = useEvaluationStepsCreationStore(
    useShallow((state) => state.areAllModulesCompleted()),
  );
  const selectedClass = useEvaluationStepsCreationStore(
    (state) => state.selectedClass,
  );
  const modules = useEvaluationStepsCreationStore(
    useShallow((state) => state.getAttendedModules()),
  );
  const setModuleSelectionIsClicked = useEvaluationStepsCreationStore(
    (state) => state.setModuleSelectionIsClicked,
  );

  const moduleSelectionState = useEvaluationStepsCreationStore(
    (state) => state.moduleSelection,
  );

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
      setModuleSelectionIsClicked(false);
      return;
    }

    onClickHandler({ e, ...clickProps, index, setOpen, open });
  };

  const commonProps = {
    pageId: `step-${index}`,
    modalMode: false,
    leftSide,
    isMobile,
    leftContent,
    card: TAB_CONTENT_VIEW_CARD_PROPS,
  };

  return (
    <TabsContent value={tabName} className={evaluationPageContainer}>
      <View {...commonProps}>
        <View.Title className="header">
          {index !== 0 && (
            <Button
              className="left-arrow"
              onClick={clickHandler}
              data-name="step-previous"
              type="button"
              aria-label="Previous step"
            >
              <IconArrowLeft />
            </Button>
          )}
        </View.Title>
        <View.Content>{props.children}</View.Content>
        <View.Footer>
          {index !== props.clickProps.arrayLength - 1 && (
            <Button
              className="right-arrow"
              onClick={clickHandler}
              data-name="next-step"
              type="button"
              aria-label="Next step"
              disabled={disableNext}
            >
              <IconArrowRightDashed />
            </Button>
          )}
        </View.Footer>
      </View>
    </TabsContent>
  );
}

function LeftSide(props: LeftSideProps) {
  const { leftSide, leftContent, isMobile } = props;

  return (
    <>
      <LeftSidePageContent item={leftSide}>{leftContent}</LeftSidePageContent>
      <Separator
        className={contentSeparator}
        orientation={isMobile ? "horizontal" : "vertical"}
      />
    </>
  );
}

const View = withTitledCard(LeftSide);
