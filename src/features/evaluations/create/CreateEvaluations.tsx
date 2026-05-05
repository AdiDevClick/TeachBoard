import { InpageTabs } from "@/components/InPageNavTabs/InpageTabs";
import { Tabs } from "@/components/ui/tabs";
import { debugLogs } from "@/configs/app-components.config";
import { TabContentList } from "@/features/evaluations/main/components/Tabs/exports/tab-content.exports";
import {
  createTabsTriggers,
  resolveNavigation,
} from "@/features/evaluations/create/functions/eval-create-functions";
import { useEvaluationNavigationHandler } from "@/features/evaluations/create/hooks/useEvaluationNavigationHandler";
import type { CreateEvaluationArrowsClickHandlerProps } from "@/features/evaluations/create/types/create.types";
import "@css/PageContent.scss";
import { useMemo } from "react";
import { Outlet } from "react-router-dom";

/**
 * Create Evaluations page component
 *
 * @description This component renders the Create Evaluations page with tabbed navigation.
 */
export function CreateEvaluations() {
  const {
    pageDatas,
    tabItems,
    tabValue,
    tabValues,
    navigateToTab,
    tabEvalState,
    setTabEvalState,
  } = useEvaluationNavigationHandler();

  /**
   * Memoized tab trigger data with disabled state based on whether the tab has been seen or not.
   */
  const tabsTriggersMemo = useMemo(() => {
    return createTabsTriggers({
      pageDatas,
      tabEvalState,
    });
  }, [pageDatas, tabEvalState]);

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
      setTabValue: navigateToTab,
      setTabEvalState,
      tabValues,
    },
    tabValue: String(tabValue),
  };

  /**
   * Handle the end of the outgoing animation -
   *
   * @description The animation triggers the tab value change that will switch content
   *
   * @important This onChange avoids a concurrence triggering navigation bug - DO NOT REMOVE to use navigateToTab directly in the onValueChange props
   *
   * @param value - The new tab value
   */
  const onChange = (value: string) => {
    debugLogs("CreateEvaluations:onChange", {
      type: "componentHandler",
      value,
      tabEvalState,
    });
    navigateToTab(value);
  };

  return (
    <Tabs
      value={tabValue}
      onValueChange={onChange}
      data-slide-direction={tabEvalState.slideDirection}
      className={"page__content-container"}
    >
      <InpageTabs
        datas={tabsTriggersMemo}
        value={tabValue}
        onValueChange={navigateToTab}
      />
      <TabContentList items={tabItems} {...tabContentPropsAndFunctions}>
        <Outlet />
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
    setTabState,
    tabValues,
    setOpen: setSideBarOpen,
    open,
    setTabEvalState,
  } = clickProps;

  const navigation = resolveNavigation({
    currentStep: e.currentTarget.dataset.name,
    index,
    arrayLength,
  });

  if (!navigation) return;

  setTabEvalState((prev) => {
    const tabsSeen = new Set(prev.tabsSeen);
    tabsSeen.add(tabValues[navigation.nextIndex]);
    return {
      ...prev,
      slideDirection: navigation.incomingDirection,
      tabsSeen,
    };
  });

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
