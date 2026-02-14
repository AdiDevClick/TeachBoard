import { InpageTabs } from "@/components/InPageNavTabs/InpageTabs";
import { TabContentList } from "@/components/Tabs/exports/tab-content.exports";
import { Tabs } from "@/components/ui/tabs";
import type { CreateEvaluationArrowsClickHandlerProps } from "@/features/evaluations/create/types/create.types";
import type { CreateEvaluationsLoaderData } from "@/routes/types/routes-config.types";
import "@css/PageContent.scss";
import { useEffect, useEffectEvent, useMemo, useState, type JSX } from "react";
import {
  Outlet,
  useLoaderData,
  useLocation,
  useNavigate,
} from "react-router-dom";

/**
 * Create Evaluations page component
 *
 * @description This component renders the Create Evaluations page with tabbed navigation.
 */
export function CreateEvaluations() {
  const { pageDatas } = useLoaderData<CreateEvaluationsLoaderData>();
  const tabItems = Object.values(pageDatas ?? {});

  const navigate = useNavigate();
  const location = useLocation();

  const [leftContent, setLeftContent] = useState<JSX.Element | null>(null);
  const [slideDirection, setSlideDirection] = useState<"left" | "right">(
    "right",
  );

  /**
   * Grab values names only so they match the url segments for navigation and redirection purposes
   */
  const tabValues = useMemo(
    () => tabItems.map((item) => item.name),
    [tabItems],
  );

  /**
   * Triggers the navigation
   *
   * @description To a specific tab based on the provided tab name.
   *
   * @param nextTabValue - The name of the tab to navigate to. It will be converted to lowercase and used as a URL segment.
   */
  const navigateToTab = (nextTabValue: string | undefined) => {
    navigate(nextTabValue?.toLocaleLowerCase() ?? "", { replace: true });
  };

  const pathSegments = location.pathname.split("/").filter(Boolean);
  const currentPathSegment = decodeURIComponent(pathSegments.at(-1) ?? "");

  /**
   * Retrieve the current tab value -
   * 
   * @description Defaults to the first tab if no match is found with the current URL segment.
   */
  const tabValue =
    tabValues.find(
      (value) =>
        value.toLocaleLowerCase() === currentPathSegment.toLocaleLowerCase(),
    ) ?? pageDatas?.step1.name;

  /**
   * INIT - CHECKER
   *
   * @description Ensure that the user is redirected to a known tab route on initial load or if the page is unknown from the tabs configuration
   */
  const ensureKnownTabRoute = useEffectEvent(() => {
    if (!pageDatas || tabItems.length === 0) {
      return;
    }

    if (currentPathSegment !== tabValue?.toLocaleLowerCase()) {
      navigateToTab(pageDatas.step1.name);
    }
  });

  /**
   * INIT - REDIRECTION
   *
   * @description Each time a uri segment change is detected
   */
  useEffect(() => {
    ensureKnownTabRoute();
  }, [currentPathSegment]);

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
  };

  return (
    <Tabs
      value={tabValue}
      onValueChange={navigateToTab}
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
    setOpen,
    open,
  } = clickProps;
  let newIndex = 0;

  const currentStep = e.currentTarget.dataset.name;
  const isPreviousAllowed = index > 0;
  const isNextAllowed = index < arrayLength - 1;

  if (currentStep === "step-previous" && isPreviousAllowed) {
    setSlideDirection("left");
    newIndex = index - 1;
  }

  if (currentStep === "next-step" && isNextAllowed) {
    setSlideDirection("right");
    if (open) {
      setOpen(false);
    }
    newIndex = index + 1;
  }

  if (newIndex === 0 && (!isPreviousAllowed || !isNextAllowed)) return;

  setTabValue(tabValues[newIndex]);
}
