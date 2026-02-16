import {
  contentSeparator,
  evaluationPageContainer,
} from "@/assets/css/EvaluationPage.module.scss";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { TabsContent } from "@/components/ui/tabs";
import { TAB_CONTENT_VIEW_CARD_PROPS } from "@/features/evaluations/create/components/Tabs/config/tab-content.configs";
import type {
  LeftSideProps,
  TabContentProps,
} from "@/features/evaluations/create/components/Tabs/types/tabs.types";
import { useTabContentHandler } from "@/features/evaluations/create/hooks/useTabContentHandler";
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
export function TabContent(props: TabContentProps) {
  const {
    index,
    leftContent,
    name: tabName,
    leftSide,
    onClick,
    slideDirection,
    clickProps,
  } = props;
  const id = `tab-content-${index}`;

  const { setRef, observedRefs, findNestedElementsByClass } =
    useMutationObserver({
      options: {
        attributes: true,
      },
    });

  const { clickHandler, tabState, setTabState, isMobile } =
    useTabContentHandler({
      name: tabName,
      clickProps,
      onClick,
      index,
    });

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
      setTabState((prev) => ({ ...prev, isAnimating: false }));
      return;
    }

    const elementsToAnimate = findNestedElementsByClass(currentPanel, {
      rightSide: "content__right-side",
      leftNumber: "--number",
      leftDescription: "--description",
      leftTitle: "--title",
    });

    playOutgoingRightSideAnimation(
      currentPanel as HTMLElement,
      slideDirection,
      elementsToAnimate,
      () => {
        setTabState((prev) => ({ ...prev, isAnimating: false }));
        if (tabState.newTabValue) clickProps.setTabValue(tabState.newTabValue);
      },
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
    pageId: `step-${index}`,
    modalMode: false,
    leftSide,
    isMobile,
    leftContent,
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
      forceMount={tabState.isAnimating ? true : undefined}
      id={id}
      value={tabName}
      data-animating={tabState.isAnimating}
      className={evaluationPageContainer}
    >
      <View {...commonProps}>
        <View.Title className="header">
          {index !== 0 && (
            <Button {...commonButtonProps} {...BUTTON_LEFT_PROPS}>
              <IconArrowLeft />
            </Button>
          )}
        </View.Title>
        <View.Content>{props.children}</View.Content>
        <View.Footer>
          {index !== props.clickProps.arrayLength - 1 && (
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
createComponentName("withTitledCard", "View", View);

function playOutgoingRightSideAnimation(
  panel: HTMLElement | null,
  direction: "left" | "right",
  elements: {
    rightSide?: Element | null;
    leftNumber?: Element | null;
    leftDescription?: Element | null;
    leftTitle?: Element | null;
  } | null,
  onDone: () => void,
) {
  if (!panel) {
    onDone();
    return;
  }

  // Use the elements provided by findAllNestedElements (no querySelector inside the fn)
  const rightSideElement = elements?.rightSide as HTMLElement | undefined;
  const leftNumberElement = elements?.leftNumber as HTMLElement | undefined;
  const leftDescriptionElement = elements?.leftDescription as
    | HTMLElement
    | undefined;
  const leftTitleElement = elements?.leftTitle as HTMLElement | undefined;

  if (!rightSideElement) {
    onDone();
    return;
  }

  const toX = direction === "right" ? "-20rem" : "20rem";
  const leftNumberToX = direction === "left" ? "10rem" : "-3rem";

  const finishOne = () => {
    onDone();
  };

  rightSideElement?.animate(
    [
      {
        // inset: "0",
        // position: "absolute",
        opacity: 1,
        transform: `translateX(0)`,
      },
      {
        // position: "absolute",
        opacity: 0,
        transform: `translateX(${toX})`,
        display: "none",
      },
    ],
    {
      duration: 200,
      // easing: "cubic-bezier(0.22, 1, 0.36, 1)",
      fill: "both",
    },
  );

  leftNumberElement?.animate(
    [
      { opacity: 1, transform: "translateX(0)" },
      { opacity: 0, transform: `translateX(${leftNumberToX})` },
    ],
    {
      duration: 500,
      // easing: "cubic-bezier(0.22, 1, 0.36, 1)",
      fill: "both",
    },
  );

  leftDescriptionElement?.animate(
    [
      { opacity: 1, transform: "translateY(0)" },
      { opacity: 0, transform: "translateY(20px)" },
    ],
    {
      duration: 200,
      // easing: "cubic-bezier(0.22, 1, 0.36, 1)",
      fill: "both",
    },
  );

  const titleAnimation = leftTitleElement?.animate(
    [
      { opacity: 1, transform: "translateY(0)" },
      { opacity: 0, transform: "translateX(-2rem)" },
    ],
    {
      duration: 400,
      easing: "cubic-bezier(0.22, 1, 0.36, 1)",
      fill: "both",
    },
  );

  if (titleAnimation) {
    titleAnimation.onfinish = finishOne;
    titleAnimation.oncancel = finishOne;
  }
}
