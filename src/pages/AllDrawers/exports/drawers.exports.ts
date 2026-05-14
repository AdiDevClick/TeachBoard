import withListMapper from "@/components/HOCs/withListMapper";
import { AppDrawer } from "@/pages/AllDrawers/AppDrawer";

/**
 * AppDrawers is a component that maps over a list of drawer configurations and renders an AppDrawer component for each configuration
 */
export const AppDrawers = withListMapper(AppDrawer);
