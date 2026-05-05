import { DynamicTags } from "@/components/Tags/DynamicTags";
import { Item, ItemGroup, ItemTitle } from "@/components/ui/item";
import { Separator } from "@/components/ui/separator";
import { useEvaluationsView } from "@/features/evaluations/full-view/hooks/useEvaluationsView";
import type { EvaluationsViewControllerProps } from "@/features/evaluations/full-view/types/evaluations.types";
import { LabelledAccordion } from "@/features/evaluations/main/components/Accordion/LabelledAccordion";
import { AverageFields } from "@/features/evaluations/main/components/score/AverageFields";

/**
 * Component that displays the details of an evaluation, including modules, student scores, and comments.
 */
export function EvaluationsViewController({
  inputControllers,
  className,
  evaluationData,
}: EvaluationsViewControllerProps) {
  const {
    modules,
    getStudentSubskillsForModule,
    studentsAverageScores,
    scoreValue,
    presence,
  } = useEvaluationsView({
    evaluationData,
  });

  return (
    <ItemGroup>
      <LabelledAccordion
        inputController={inputControllers!.modules}
        accordionItems={modules}
        storeGetter={getStudentSubskillsForModule}
        valueGetter={scoreValue}
      />
      <Separator className="mx-auto my-2 max-w-1/3" orientation="horizontal" />
      <div className={className}>
        <AverageFields
          form={null!}
          students={studentsAverageScores}
          {...inputControllers!.scoresAverage}
          viewMode={true}
        />
        <Separator
          className="mx-auto my-2 max-w-1/3"
          orientation="horizontal"
        />
        <DynamicTags
          {...inputControllers!.absence}
          itemList={presence.students}
          displayCRUD={false}
          disableAnimation
        />
        <Separator
          className="mx-auto my-2 max-w-1/3"
          orientation="horizontal"
        />
        <Item className="p-0">
          <ItemTitle>{inputControllers!.comments.title}</ItemTitle>
          <p className="whitespace-pre-wrap break-all">
            {evaluationData?.comments ?? "Aucun commentaire."}
          </p>
        </Item>
      </div>
    </ItemGroup>
  );
}
