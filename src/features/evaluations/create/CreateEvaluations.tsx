import { InpageTabs } from "@/components/InPageNavTabs/InpageTabs";
import { Tabs } from "@/components/ui/tabs";
import { TabContentList } from "@/features/evaluations/create/components/Tabs/exports/tab-content.exports";
import { resolveNavigation } from "@/features/evaluations/create/functions/eval-create-functions";
import { useEvaluationNavigationHandler } from "@/features/evaluations/create/hooks/useEvaluationNavigationHandler";
import type { CreateEvaluationArrowsClickHandlerProps } from "@/features/evaluations/create/types/create.types";
import "@css/PageContent.scss";
import { useState, type JSX } from "react";
import { Outlet } from "react-router-dom";

/**
 * Create Evaluations page component
 *
 * @description This component renders the Create Evaluations page with tabbed navigation.
 */
export function CreateEvaluations() {
  const { pageDatas, tabItems, tabValue, tabValues, navigateToTab } =
    useEvaluationNavigationHandler();

  const [leftContent, setLeftContent] = useState<JSX.Element | null>(null);
  const [slideDirection, setSlideDirection] = useState<"left" | "right">(
    "right",
  );

  if (!pageDatas || tabItems.length === 0) {
    return <div>Loading...</div>;
  }

  /**
   * Props for TabContent components
   *
   * @description index needs to be passed for arrow navigation
   *
   * @remarks This also contains leftContent state to be passed to each TabContent
   */
  const tabContentPropsAndFunctions = {
    onClick: handleOnArrowClick,
    clickProps: {
      arrayLength: Object.keys(pageDatas).length,
      setSlideDirection,
      setTabValue: navigateToTab,
      tabValues,
    },
    leftContent,
    slideDirection,
    tabValue,
  };

  return (
    <Tabs
      value={tabValue}
      onValueChange={navigateToTab}
      data-slide-direction={slideDirection}
      className="page__content-container"
    >
      <InpageTabs
        datas={pageDatas}
        value={tabValue}
        onValueChange={navigateToTab}
      />
      <TabContentList items={tabItems} {...tabContentPropsAndFunctions}>
        <Outlet context={[leftContent, setLeftContent]} />
      </TabContentList>
    </Tabs>
  );
}

/**
 * Handle click events for tab navigation.
 *
 * @param e - Mouse event from the click
 * @param clickProps - Object containing index, arrayLength, setSlideDirection, setTabValue, and tabValues
 */
function handleOnArrowClick({
  e,
  ...clickProps
}: CreateEvaluationArrowsClickHandlerProps) {
  e.preventDefault();
  const {
    index,
    arrayLength,
    setSlideDirection,
    setTabValue,
    tabValues,
    setOpen: setSideBarOpen,
    open,
  } = clickProps;
  const navigation = resolveNavigation({
    currentStep: e.currentTarget.dataset.name,
    index,
    arrayLength,
  });

  if (!navigation) return;

  setSlideDirection(navigation.incomingDirection);

  if (navigation.incomingDirection === "right") {
    if (open) {
      setSideBarOpen?.(false);
    }
  }

  const currentPanel = e.currentTarget.closest<HTMLElement>(
    '[data-slot="tabs-content"]',
  );

  if (currentPanel) {
    playOutgoingRightSideAnimation(
      currentPanel,
      navigation.outgoingDirection,
      () => {
        setTabValue(tabValues[navigation.nextIndex]);
      },
    );
  } else {
    setTabValue(tabValues[navigation.nextIndex]);
  }
}

function playOutgoingRightSideAnimation(
  panel: HTMLElement | null,
  direction: "left" | "right",
  onDone: () => void,
) {
  if (!panel) {
    onDone();
    return;
  }

  // if (panel.dataset.animatingOut === "true") {
  //   return;
  // }

  const rightSideElement = panel.querySelector<HTMLElement>(
    '[class*="content__right-side"][data-slot="card"]',
  );
  const leftNumberElement = panel.querySelector<HTMLElement>(
    '[class*="content__left-side--number"]',
  );
  const leftDescriptionElement = panel.querySelector<HTMLElement>(
    '[class*="content__left-side--description"]',
  );
  const leftTitleElement = panel.querySelector<HTMLElement>(
    '[class*="content__left-side--title"]',
  );

  if (!rightSideElement) {
    onDone();
    return;
  }

  panel.dataset.animatingOut = "true";

  const toX = direction === "left" ? "-20rem" : "20rem";
  const leftNumberToX = direction === "left" ? "1rem" : "-1rem";

  const finishOne = () => {
    onDone();
  };

  const animation = rightSideElement.animate(
    [
      { isolation: "isolate", opacity: 1, transform: "translateX(0)" },
      { isolation: "isolate", opacity: 0, transform: `translateX(${toX})` },
    ],
    {
      duration: 500,
      easing: "cubic-bezier(0.22, 1, 0.36, 1)",
      fill: "both",
    },
  );

  const numberAnimation = leftNumberElement?.animate(
    [
      { opacity: 1, transform: "translateX(0)" },
      { opacity: 0, transform: `translateX(${leftNumberToX})` },
    ],
    {
      duration: 400,
      easing: "cubic-bezier(0.22, 1, 0.36, 1)",
      fill: "both",
    },
  );

  const descriptionAnimation = leftDescriptionElement?.animate(
    [
      { opacity: 1, transform: "translateY(0)" },
      { opacity: 0, transform: "translateY(20px)" },
    ],
    {
      duration: 200,
      easing: "cubic-bezier(0.22, 1, 0.36, 1)",
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

  animation.onfinish = finishOne;
  animation.oncancel = finishOne;
  if (numberAnimation) {
    numberAnimation.onfinish = finishOne;
    numberAnimation.oncancel = finishOne;
  }

  if (titleAnimation) {
    titleAnimation.onfinish = finishOne;
    titleAnimation.oncancel = finishOne;
  }

  if (descriptionAnimation) {
    descriptionAnimation.onfinish = finishOne;
    descriptionAnimation.oncancel = finishOne;
  }
}
