import type {
  MatchWithTitle,
  PageTitleState,
} from "@/hooks/types/use-page-title.types";
import type { useMatches } from "react-router-dom";

/**
 * Retrieve the previous and original titles for a route
 *
 * @param routeId - The ID of the route (React Router loader route ID)
 * @param title - The current title to set if no previous title exists
 * @param state - The current state of the usePageTitle hook
 *
 * @returns An object containing the title to set and the original title for the route
 */
export function getPrevsTitles(
  routeId: string,
  title: string,
  state: Pick<PageTitleState, "routesTitles">,
) {
  const prev = state.routesTitles.get(routeId);
  const existingOriginalTitle = prev?.originalTitle;
  const titleInit = prev?.title ?? title;

  return {
    title: titleInit,
    originalTitle: existingOriginalTitle ?? title,
  };
}

/**
 * Get the matching loader for the current location
 *
 * @param hook - The useMatches hook from react-router-dom to access the current route matches
 * @param location - The current location pathname to find the matching loader for
 *
 * @returns - The matching loader with title data if found, otherwise undefined
 */
export function getMatchingLoader(hook: typeof useMatches, location: string) {
  return hook().find(
    (m): m is MatchWithTitle =>
      m.loaderData !== undefined && m.pathname === location,
  );
}
