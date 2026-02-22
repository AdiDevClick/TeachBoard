import {
  contentSeparator,
  evaluationPageContainer,
} from "@/assets/css/EvaluationPage.module.scss";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { TabsContent } from "@/components/ui/tabs";
import { TAB_CONTENT_VIEW_CARD_PROPS } from "@/features/evaluations/create/components/Tabs/config/tab-content.configs";
import { getAnimatedElements } from "@/features/evaluations/create/components/Tabs/functions/tabs.functions";
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
import { useEffect, useEffectEvent } from "react";

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
 * @param props - Additional props including onClick handler and clickProps
 */
export function TabContent({
  index,
  leftSide,
  name: tabName,
  onClick,
  clickProps,
  children,
}: TabContentProps) {
  const id = `tab-content-${index}`;

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

  const onFinish = () => {
    setTabState((prev) => ({ ...prev, isAnimating: false }));
    if (tabState.newTabValue) clickProps.setTabValue(tabState.newTabValue);
  };

  /**
   * ANIMATION - Trigger
   *
   * @description Targets elements and use Web Animations API to play the outgoing animations
   */
  const animationTrigger = useEffectEvent(() => {
    if (!tabState.isAnimating) return;

    const currentPanel = observedRefs.get(id)?.element ?? null;

    if (!currentPanel) {
      console.warn("Current panel not found for id:", id);
      onFinish();
      return;
    }

    const {
      rightSide,
      leftNumber,
      leftDescription,
      leftTitle,
      rightSideStepThreeEvaluation,
      leftSubskillSelection,
    } = getAnimatedElements(currentPanel, findAllNestedElements);

    const isStepThreeEvaluation = moduleSelectionState.isClicked;

    // normal right side animation (all tabs if no evaluation step is shown)
    if (rightSide && !isStepThreeEvaluation) {
      rightSide.style.animation = "outgoing-rightside 500ms both";
    }

    // evaluation is shown, others won't be animated
    if (rightSideStepThreeEvaluation && leftSubskillSelection) {
      rightSideStepThreeEvaluation.style.animation =
        "step-three-evaluation-out 500ms both";
      leftSubskillSelection.style.animation = "out-left-desc 200ms both 0.2s";
    }

    if (!isStepThreeEvaluation) {
      leftDescription.style.animation = "out-left-desc 200ms both";
    }

    leftNumber.style.animation = "out-left-number 500ms linear both";
    leftTitle.style.animation =
      "out-left-title 400ms cubic-bezier(0.22,1,0.36,1) both";
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

  return (
    <TabsContent
      ref={(el) =>
        setRef(el, {
          name: id,
        })
      }
      id={id}
      value={tabName}
      data-animating={tabState.isAnimating}
      className={evaluationPageContainer}
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
          <StepThreeSubskillsSelectionController isActive={isClicked} />
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
