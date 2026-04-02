import { Badge } from "@/components/ui/badge";
import {
  Item,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from "@/components/ui/item";
import { LabelledScoreInputList } from "@/features/evaluations/create/components/Score/exports/labelled-score-input.exports";
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
  return (
    <Item className="flex-col items-start p-0 gap-2" {...props}>
      <ItemTitle>{title}</ItemTitle>
      <ItemDescription>{description}</ItemDescription>
      {students.length < 1 && (
        <Badge variant="outline" className="mx-auto">
          {placeholder}
        </Badge>
      )}
      <ItemGroup className="mx-auto">
        {students.length > 0 && !viewMode && (
          <LabelledScoreInputList
            items={students}
            form={form}
            optional={(tuple) => {
              return {
                id: tuple[0],
                item: tuple[1],
              };
            }}
          />
        )}
        {students.length > 0 &&
          viewMode &&
          students.map(([, student]) => (
            <Item
              key={student.name}
              className="w-full items-center justify-between rounded-md border"
              variant="outline"
              size="sm"
            >
              <Badge>{student.name}</Badge>
              <p className="tabular-nums text-sm">
                {formatParseFloat(student.score / 5)}
                {" /20"}
              </p>
            </Item>
          ))}
      </ItemGroup>
    </Item>
  );
}
