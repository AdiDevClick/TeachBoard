import { Badge } from "@/components/ui/badge";
import {
  Item,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from "@/components/ui/item";
import { LabelledScoreInputList } from "@/features/evaluations/create/components/Score/exports/labelled-score-input.exports";
import type { AverageFieldsProps } from "@/features/evaluations/create/components/Score/types/score-types";

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
  ...props
}: AverageFieldsProps) {
  const {
    title = "Moyenne",
    description = "Note générale",
    placeholder = "Aucune note",
  } = props;

  return (
    <Item className="flex-col items-start p-0 gap-2" {...props}>
      <ItemTitle>{title}</ItemTitle>
      <ItemDescription>{description}</ItemDescription>
      {students.size < 1 && (
        <Badge variant="outline" className="mx-auto">
          {placeholder}
        </Badge>
      )}
      <ItemGroup className="mx-auto">
        {students.size > 0 && (
          <LabelledScoreInputList
            items={Array.from(students.entries())}
            form={form}
            optional={(tuple) => {
              return {
                id: tuple[0],
                item: tuple[1],
              };
            }}
          />
        )}
      </ItemGroup>
    </Item>
  );
}
