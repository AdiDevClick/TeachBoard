import {
  contentLeftSideContent,
  contentSeparator,
  evaluationPageContainer,
} from "@/assets/css/EvaluationPage.module.scss";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { TabsContent } from "@/components/ui/tabs";
import { TAB_CONTENT_VIEW_CARD_PROPS } from "@/features/evaluations/create/components/Tabs/config/tab-content.configs";
import {
  animateUnmoutedElements,
  getAnimatedElements,
} from "@/features/evaluations/create/components/Tabs/functions/tabs.functions";
import type {
  LeftSideProps,
  TabContentProps,
} from "@/features/evaluations/create/components/Tabs/types/tabs.types";
import { useTabContentHandler } from "@/features/evaluations/create/hooks/tab-handler/useTabContentHandler";
import { StepThreeSubskillsSelectionController } from "@/features/evaluations/create/steps/three/controllers/StepThreeSubskillsSelectionController";
import { useMutationObserver } from "@/hooks/useMutationObserver";
import { LeftSidePageContent } from "@/pages/Evaluations/create/left-content/LeftSidePageContent";
import { createComponentName } from "@/utils/utils";
import withTitledCard from "@components/HOCs/withTitledCard.tsx";
import { IconArrowLeft, IconArrowRightDashed } from "@tabler/icons-react";
import { useEffect, useEffectEvent, type TransitionEvent } from "react";

const BUTTON_LEFT_PROPS = {
  "data-name": "step-previous",
  "aria-label": "Previous step",
  className: "left-arrow",
} as const;

const BUTTON_RIGHT_PROPS = {
  "data-name": "next-step",
  "aria-label": "Next step",
  className: "right-arrow",
} as const;

/**
 * Tab content component for evaluation creation page.
 *
 * @param index - Index of the current tab
 * @param name - Name of the tab
 * @param leftSide - Data for the left side content
 * @param children - Right side content component
 * @param onClick - Click handler for the navigation buttons
 * @param clickProps - Additional properties for handling click events and navigation logic
 * @param tabValue - Current active tab value in the router
 *
 * @description This component manages the content of each tab in the evaluation creation process, including the left side content, right side content, and the navigation logic with animations when switching between tabs.
 *
 * @remarks The tabs are NOT unmounted when not active, but they are hidden with CSS and animated on click. The state is managed to trigger the outgoing animations and then switch the content after the animation is finished.
 *
 * @remarks The tabValue is used for the step 4 - "Archiver" to trigger the specific animation when coming from step 3
 *
 */
export function TabContent({
  index,
  leftSide,
  name: tabName,
  onClick,
  clickProps,
  children,
  tabValue,
}: TabContentProps) {
  const id = `tab-content-${index + 1}`;

  const { setRef, observedRefs, findAllNestedElements } = useMutationObserver({
    options: {
      attributes: true,
    },
  });

  const {
    clickHandler,
    tabState,
    setTabState,
    isMobile,
    moduleSelectionState,
  } = useTabContentHandler({
    name: tabName,
    clickProps,
    onClick,
    index,
  });

  /**
   * ANIMATION - Finish handler
   *
   * @description Resets the state after the outgoing animation is finished and triggers the tab change by updating the tabValue in the parent component through clickProps.setTabValue.
   */
  const onFinish = () => {
    setTabState((prev) => ({ ...prev, isAnimating: false }));
    if (tabState.newTabValue) clickProps.setTabValue(tabState.newTabValue);
  };

  /**
   * ANIMATION - Trigger outgoing animations
   *
   * @description Targets elements by searching in the mutationObs and animate them @see animateUnmoutedElements
   */
  const animationTrigger = useEffectEvent(() => {
    if (!tabState.isAnimating) return;

    const currentPanel = observedRefs.get(id)?.element ?? null;

    if (!currentPanel) {
      console.warn("Current panel not found for id:", id);
      onFinish();
      return;
    }

    animateUnmoutedElements(
      getAnimatedElements(currentPanel, findAllNestedElements),
      moduleSelectionState.isClicked,
    );
  });

  /**
   * ANIMATION LOGIC -
   *
   * @description Each time an arrow from the tabs are clicked
   */
  useEffect(() => {
    animationTrigger();
  }, [tabState.isAnimating]);

  const commonProps = {
    pageId: `step-${index + 1}`,
    modalMode: false,
    leftSide,
    isClicked: moduleSelectionState.isClicked,
    isMobile,
    card: TAB_CONTENT_VIEW_CARD_PROPS,
  };

  const commonButtonProps = {
    onClick: clickHandler,
    type: "button",
  } as const;

  /**
   * Removing the activeTransitioning for the step "Archiver"
   *
   * @description An overflow hidden was necessary for the step "Archiver" where the scrollbar appears during the transition.
   */
  const handlerTransitionEnd = (e: TransitionEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const dataset = target.dataset;

    if (dataset.stepId === "Archiver" && e.propertyName === "transform") {
      if (dataset.activeTransitioning === "true") {
        dataset.activeTransitioning = "false";
      }
    }
  };

  return (
    <TabsContent
      ref={(el) =>
        setRef(el, {
          name: id,
        })
      }
      id={id}
      data-step-id={tabName}
      data-active-transitioning={
        tabValue === "Archiver" && tabName === "Archiver"
      }
      value={tabName}
      data-animating={tabState.isAnimating}
      className={evaluationPageContainer}
      onTransitionEnd={handlerTransitionEnd}
      onAnimationEnd={(e) => {
        if (e.animationName === "out-left-title") {
          onFinish();
        }
      }}
    >
      <View {...commonProps}>
        <View.Title className="header">
          {index !== 0 && (
            <Button {...commonButtonProps} {...BUTTON_LEFT_PROPS}>
              <IconArrowLeft />
            </Button>
          )}
        </View.Title>
        <View.Content>{children}</View.Content>
        <View.Footer>
          {index !== clickProps.arrayLength - 1 && (
            <Button
              {...commonButtonProps}
              {...BUTTON_RIGHT_PROPS}
              disabled={tabState.isNextDisabled}
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
  const { leftSide, isClicked, isMobile, pageId } = props;
  return (
    <>
      <LeftSidePageContent item={leftSide} isClicked={isClicked}>
        {pageId === "step-3" && (
          <div
            className={contentLeftSideContent}
            data-left-content={isClicked ? "expanded" : "collapsed"}
          >
            <StepThreeSubskillsSelectionController isActive={isClicked} />
          </div>
        )}
      </LeftSidePageContent>
      <Separator
        className={contentSeparator}
        orientation={isMobile ? "horizontal" : "vertical"}
      />
    </>
  );
}

/**
 * The LeftSide component wrapped with a titled card layout.
 *
 * The children passed to the View will be rendered as the right side
 */
const View = withTitledCard(LeftSide);
createComponentName("withTitledCard", "View", View);
