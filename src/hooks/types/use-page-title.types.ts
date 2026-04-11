import type { UniqueSet } from "@/utils/UniqueSet";
import type { useMatches } from "react-router-dom";

/**
 * Type definitions for usePageTitle hook
 */
export type MatchWithTitle = ReturnType<typeof useMatches>[number] & {
  loaderData: { pageTitle?: string };
};

/**
 * Type definitions for usePageTitle hook state
 */
export type PageTitleState = {
  /** Whether the page title is being edited */
  isEditing: boolean;
  /** A Map() saved page titles for each route - The key is the React router dom loader route ID */
  routesTitles: UniqueSet<
    string,
    { title: string | null; originalTitle: string | null }
  >;
};
