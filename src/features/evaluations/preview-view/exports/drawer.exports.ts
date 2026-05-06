import withListMapper from "@/components/HOCs/withListMapper";
import { DrawerSection } from "@/features/evaluations/preview-view/components/drawer-section/DrawerSection";
import { createComponentName } from "@/utils/utils";

/**
 * Exports of the drawer components, to avoid circular dependencies between the sections and the content of the drawer.
 */
export const DrawerSectionList = withListMapper(DrawerSection);
createComponentName("withListMapper", "DrawerSectionList", DrawerSectionList);
