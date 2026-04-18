import type { InpageTabsProps } from "@/components/InPageNavTabs/types/navtabs.types";
import type {
  CreateTabsTriggersProps,
  NavigationResult,
  ResolveNavigationProps,
} from "@/features/evaluations/create/types/create.types";
import type { useLocation } from "react-router-dom";

/**
 * Resolve the next tab index and animation directions based on the clicked button and current index.
 *
 * @param currentStep - The data-name of the clicked button, either "step-previous" or "next-step"
 * @param index - The current index of the tab
 * @param arrayLength - The total number of tabs
 * @returns An object containing the next index and animation directions, or null if navigation is not possible
 */
export function resolveNavigation({
  currentStep,
  index,
  arrayLength,
}: ResolveNavigationProps): NavigationResult | null {
  if (currentStep === "step-previous" && index > 0) {
    return {
      nextIndex: index - 1,
      incomingDirection: "left",
      outgoingDirection: "right",
    };
  }

  if (currentStep === "next-step" && index < arrayLength - 1) {
    return {
      nextIndex: index + 1,
      incomingDirection: "right",
      outgoingDirection: "left",
    };
  }

  return null;
}
/**
 * Creates the data object for the InpageTabs component, adding a disabled state to each tab based on whether it has been seen or not.
 *
 * @param pageDatas - The data for each tab, including its name and content
 * @param tabEvalState - The current state of the tab evaluation, including which tabs have been seen
 *
 * @returns An object containing the data for each tab, with an added disabled property
 */
export function createTabsTriggers({
  pageDatas,
  tabEvalState,
}: CreateTabsTriggersProps): InpageTabsProps["datas"] {
  if (!pageDatas) {
    return {};
  }

  return Object.fromEntries(
    Object.entries(pageDatas).map(([key, item]) => {
      const disabled = !tabEvalState.tabsSeen.has(item.name);
      return [key, { ...item, disabled }];
    }),
  ) satisfies InpageTabsProps["datas"];
}

/**
 * Retrieves the current tab value based on the URL segment, matching it with the available tab values.
 *
 * @param tabValues - An array of available tab values (names)
 * @param currentPathSegment - The current URL segment to match against the tab values
 *
 * @returns The matching tab value if found, or undefined if no match is found
 */
export function retrieveCurrentTabValue(
  tabValues: string[],
  currentPathSegment: string,
) {
  return tabValues.find(
    (value) =>
      value.toLocaleLowerCase() === currentPathSegment.toLocaleLowerCase(),
  );
}

/**
 * Computes the current URI segment from the location object, making sure to decode it for proper matching with tab values.
 *
 * @param location - The location object from react-router, containing the current pathname
 *
 * @returns The decoded URI segment that represents the current tab or page
 */
export function computeUriSegment(location: ReturnType<typeof useLocation>) {
  const pathSegments = location.pathname.split("/").filter(Boolean);
  return decodeURIComponent(pathSegments.at(-1) ?? "");
}
