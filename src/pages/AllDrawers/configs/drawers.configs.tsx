import { LazyEventView } from "@/features/calendar/event-view/exports/event-view.exports";
import type { AppDrawerProps } from "@/pages/AllDrawers/types/drawers.types";
import type { AppDrawer } from "@/pages/AllDrawers/AppDrawer";
import type { useDrawer } from "@/hooks/useDrawer";

/**
 * List of drawer configurations for the application, used to render AppDrawer components with specific content based on the appDrawerName.
 *
 * Each configuration includes the name of the drawer, the content to be rendered inside the drawer, and any additional props for the AppDrawer component.
 *
 * @description The `appDrawerName` should correspond to the identifiers used in the application for managing drawer states, ensuring that the correct content is displayed when a drawer is opened.
 *
 * @remark Drawers listed here are not meant to be used for navigation purposes but rather for displaying contextual information or actions related to the current page or user interactions.
 *  If you wish to use a drawer for navigation, consider using the {@link AppDrawer} component directly with the use of {@link useDrawer} instead, which are designed for that purpose.
 *
 * @see AppDrawerProps for the type definition of each drawer configuration.
 */
export const drawers: AppDrawerProps<any>[] = [
  {
    appDrawerName: "event-view",
    children: <LazyEventView />,
  },
];
