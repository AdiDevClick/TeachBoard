import type { CreateEvaluationsLoaderData } from "@/routes/types/routes-config.types";
import { useEffect, useEffectEvent, useMemo } from "react";
import { useLoaderData, useLocation, useNavigate } from "react-router-dom";

/**
 * Custom hook to manage the navigation logic for the Create Evaluations page.
 *
 * @returns
 */
export function useEvaluationNavigationHandler() {
  const { pageDatas } = useLoaderData<CreateEvaluationsLoaderData>();
  const tabItems = Object.values(pageDatas ?? {});

  const navigate = useNavigate();
  const location = useLocation();

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

  return {
    tabValue,
    tabValues,
    navigateToTab,
    tabItems,
    pageDatas,
  };
}
