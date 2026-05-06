import withListMapper from "@/components/HOCs/withListMapper";
import { Badge } from "@/components/ui/badge";
import type { DetailedEvaluationView } from "@/features/evaluations/main/models/evaluations-view.models";
import { DateText } from "@/features/evaluations/preview-view/components/dates/DateText";
import { EvaluationResultsPreview } from "@/features/evaluations/preview-view/components/results-preview/EvaluationPreview";
import type { DrawerSectionList } from "@/features/evaluations/preview-view/exports/drawer.exports";
import { createComponentName } from "@/utils/utils";
import type { ComponentProps } from "react";

/**
 * Defines the sections to be displayed in the evaluation detail drawer, including results, absents, comments, and info sections.
 *
 * @structure
 * - "title": The title of the section displayed in the drawer.
 * - "disabled": A boolean indicating whether the section should be disabled (e.g., if there are no absents or comments).
 * - "separator": A boolean indicating whether a separator should be displayed before the section (e.g., for the info section).
 * - "children": The content of the section, which can include lists of results, absents, comments, and info details such as creation and update dates.
 *
 * @param evaluation - The detailed evaluation data used to populate the sections with relevant information.
 *
 * @see DrawerSectionList for the structure of the sections and how they are rendered in the drawer.
 */
export const sections = (evaluation: DetailedEvaluationView) => {
  const { evaluations, comments, absentStudents, updatedAt, createdAt } =
    evaluation;

  return [
    {
      title: "Résultats des élèves",
      children: (
        <ul className="grid gap-1.5">
          <EvaluationResultsPreviewList items={evaluations} />
        </ul>
      ),
    },
    {
      title: "Absents",
      disabled: !absentStudents.length,
      children: (
        <p className="text-muted-foreground">
          <AbsentsList
            items={absentStudents}
            variant="outline"
            className="mr-1 mb-1"
            optional={(student) => ({
              children: student.name,
            })}
          />
        </p>
      ),
    },
    {
      title: "Commentaires",
      disabled: !comments,
      children: <p className="text-muted-foreground">{comments}</p>,
    },
    {
      title: "Infos",
      separator: Boolean(createdAt || updatedAt),
      disabled: !createdAt && !updatedAt,
      children: (
        <div>
          <DateText disabled={!createdAt} text="Créée le" date={createdAt} />
          <DateText
            disabled={!updatedAt}
            text="Dernière mise à jour le"
            date={updatedAt}
          />
        </div>
      ),
    },
  ] satisfies ComponentProps<typeof DrawerSectionList>["items"][];
};

const AbsentsList = withListMapper(Badge);
const EvaluationResultsPreviewList = withListMapper(EvaluationResultsPreview);
createComponentName("withListMapper", "AbsentsList", AbsentsList);
createComponentName(
  "withListMapper",
  "EvaluationResultsPreviewList",
  EvaluationResultsPreviewList,
);
