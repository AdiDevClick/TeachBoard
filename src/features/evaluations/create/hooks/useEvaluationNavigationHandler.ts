import { debugLogs } from "@/configs/app-components.config";
import {
  computeUriSegment,
  retrieveCurrentTabValue,
} from "@/features/evaluations/create/functions/eval-create-functions";
import type { TabEvalState } from "@/features/evaluations/create/hooks/types/use-tab-content-handler.types";
import type { CreateEvaluationsLoaderData } from "@/routes/types/routes-config.types";
import { useEffect, useEffectEvent, useMemo, useState } from "react";
import { useLoaderData, useLocation, useNavigate } from "react-router-dom";

/**
 * Custom hook to manage the navigation logic for the Create Evaluations page.
 */
export function useEvaluationNavigationHandler() {
  const [tabEvalState, setTabEvalState] = useState<TabEvalState>({
    slideDirection: "right",
    tabsSeen: new Set(["Classe"]),
  });

  const { pageDatas } = useLoaderData<CreateEvaluationsLoaderData>();
  const navigate = useNavigate();
  const location = useLocation();

  const tabItems = Object.values(pageDatas ?? {});

  /**
   * Grab values names only so they match the url segments for navigation and redirection purposes
   */
  const tabValues = useMemo(
    () => tabItems.map((item) => item.name),
    [tabItems],
  );

  const currentPathSegment = computeUriSegment(location);

  /**
   * Defaults to the first tab if no match is found
   */
  const tabValue =
    retrieveCurrentTabValue(tabValues, currentPathSegment) ??
    pageDatas?.step1.name;

  /**
   * Triggers the navigation
   *
   * @description To a specific tab based on the provided tab name.
   *
   * @param nextTabValue - The name of the tab to navigate to. It will be converted to lowercase and used as a URL segment.
   */
  const navigateToTab = (nextTabValue: string | undefined) => {
    debugLogs("useEvaluationNavigationHandler:navigateToTab", {
      type: "componentHandler",
      value: nextTabValue,
    });
    navigate(nextTabValue?.toLocaleLowerCase() ?? "");
  };

  /**
   * INIT - CHECKER
   *
   * @description Ensure that the user is redirected to a known tab route on initial load or if the page is unknown from the tabs configuration
   */
  const ensureKnownTabRoute = useEffectEvent(() => {
    if (!pageDatas || tabItems.length === 0) {
      return;
    }

    if (
      currentPathSegment.toLocaleLowerCase() !== tabValue?.toLocaleLowerCase()
    ) {
      debugLogs("useEvaluationNavigationHandler:ensureKnownTabRoute", {
        type: "componentHandler",
        value: currentPathSegment,
        expectedValues: tabValues,
        willForceNavigationTo: pageDatas.step1.name,
      });
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

  return {
    tabValue,
    tabValues,
    navigateToTab,
    tabItems,
    pageDatas,
    tabEvalState,
    setTabEvalState,
  };
}
