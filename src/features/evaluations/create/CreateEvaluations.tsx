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
    setTabState,
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

  setTabState((prev) => ({
    ...prev,
    isAnimating: true,
    nextIndex: navigation.nextIndex,
    newTabValue: tabValues[navigation.nextIndex],
  }));
}
