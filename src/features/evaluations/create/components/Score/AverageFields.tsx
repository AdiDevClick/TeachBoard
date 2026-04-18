import { Badge } from "@/components/ui/badge";
import {
  Item,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from "@/components/ui/item";
import {
  LabelledScoreInputList,
  LabelledScoreList,
} from "@/features/evaluations/create/components/Score/exports/labelled-score-input.exports";
import type { AverageFieldsProps } from "@/features/evaluations/create/components/Score/types/score-types";
import { formatParseFloat } from "@/utils/utils";

/**
 * Component to display the average scores of students in an evaluation.
 *
 * @param form  The form object containing the average scores.
 * @param students  The map of student IDs to their average scores.
 *
 * @description This component displays the average score for each student evaluated in the current subskill.
 * If no students have been evaluated, it shows a message indicating that there are no scores.
 *
 * @returns The rendered AverageFields component.
 */
export function AverageFields({
  form,
  students,
  title = "Moyenne",
  description = "Note générale",
  placeholder = "Aucune note",
  viewMode = false,
  ...props
}: AverageFieldsProps) {
  const areStudentsEvaluated = students.length > 0;
  return (
    <Item className="flex-col items-start p-0 gap-2" {...props}>
      <ItemTitle>{title}</ItemTitle>
      <ItemDescription>{description}</ItemDescription>
      {!areStudentsEvaluated && (
        <Badge variant="outline" className="mx-auto">
          {placeholder}
        </Badge>
      )}
      <ItemGroup className="mx-auto">
        {areStudentsEvaluated &&
          (viewMode ? (
            /** No input allowed in view mode */
            <LabelledScoreList
              items={students}
              optional={([, student]) => ({
                item: student,
                children: formatParseFloat(student.score / 5),
              })}
            />
          ) : (
            /** Controlled Input */
            <LabelledScoreInputList
              items={students}
              form={form}
              optional={([id, item]) => ({
                id,
                item,
              })}
            />
          ))}
      </ItemGroup>
    </Item>
  );
}
