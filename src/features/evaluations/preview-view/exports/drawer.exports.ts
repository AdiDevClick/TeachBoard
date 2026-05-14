import withListMapper from "@/components/HOCs/withListMapper";
import { withVerticalDrawer } from "@/components/HOCs/withVerticalDrawer";
import { DetailContent } from "@/features/evaluations/preview-view/components/drawer-detail/EvaluationDetailDrawer";
import { DrawerSection } from "@/features/evaluations/preview-view/components/drawer-section/DrawerSection";
import { createComponentName } from "@/utils/utils";

/**
 * Exports of the drawer components, to avoid circular dependencies between the sections and the content of the drawer.
 */
export const DrawerSectionList = withListMapper(DrawerSection);
createComponentName("withListMapper", "DrawerSectionList", DrawerSectionList);

/**
 * Creates a layered vertical drawer component for displaying evaluation details
 *
 * @description It uses the Compound component pattern to allow for flexible composition of the drawer's header, content, and footer.
 */
export const EvaluationDrawer = withVerticalDrawer(DetailContent);
