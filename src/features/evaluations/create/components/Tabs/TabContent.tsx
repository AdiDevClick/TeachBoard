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
import { useTabContentHandler } from "@/features/evaluations/create/hooks/tab-handler/useTabContentHandler";
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

    const { rightSide, leftNumber, leftDescription, leftTitle } =
      findNestedElementsByClass(currentPanel, {
        rightSide: "content__right-side",
        leftNumber: "--number",
        leftDescription: "--description",
        leftTitle: "--title",
      });

    // apply animations to the elements
    // EvaluationPage.module.scss file is reading the slide direction from the data attribute of the parent component (left or right) and apply the propertes --outgoing-offset or --left-number-offset
    rightSide.style.animation = "outgoing-rightside 500ms both";
    leftNumber.style.animation = "out-left-number 500ms linear both";
    leftDescription.style.animation = "out-left-desc 200ms both";
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
