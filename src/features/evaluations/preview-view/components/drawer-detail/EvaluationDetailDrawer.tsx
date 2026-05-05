import type { DetailContentProps } from "@/features/evaluations/preview-view/components/drawer-detail/types/evaluation-drawer-details.types";
import { sections } from "@/features/evaluations/preview-view/configs/drawer.configs";
import { DrawerSectionList } from "@/features/evaluations/preview-view/exports/drawer.exports";

/**
 * Component to display the content of the evaluation detail drawer, including various sections with information about the evaluation.
 *
 * @description The content is structured into sections, each containing specific details about the evaluation, such as general information, assigned tasks, student results, and more. The sections are generated based on the evaluation data passed as a prop.
 *
 * @see sections in "@/features/evaluations/main/components/configs/drawer.configs" for the configuration of the sections displayed in the drawer.
 *
 * @param evaluation - The evaluation data to be displayed in the drawer, containing all necessary information for the sections.
 */
export function DetailContent({ evaluation }: DetailContentProps) {
  return (
    <div className="flex flex-col gap-6 overflow-y-auto px-4 py-2 text-sm">
      <DrawerSectionList items={sections(evaluation)} />
    </div>
  );
}
