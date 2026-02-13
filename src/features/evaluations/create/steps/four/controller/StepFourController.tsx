import { summaryPageContent } from "@/assets/css/SummaryPage.module.scss";
import { ListMapper } from "@/components/Lists/ListMapper";
import { EvaluationSliderList } from "@/components/Sliders/exports/sliders.exports";
import { ControlledDynamicTagList } from "@/components/Tags/exports/dynamic-tags.exports";
import type { DynamicItemTuple } from "@/components/Tags/types/tags.types";
import { ControlledLabelledTextArea } from "@/components/TextAreas/exports/labelled-textarea";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { CardDescription } from "@/components/ui/card";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item";
import { LabelledScoreInputList } from "@/features/evaluations/create/components/Score/exports/labelled-score-input.exports";
import { useStepThreeState } from "@/features/evaluations/create/hooks/useStepThreeState";
import { useMemo, type ComponentProps } from "react";

type StepFourControllerProps = Readonly<{
  pageId: string;
  form: ComponentProps<typeof ControlledDynamicTagList>["form"];
  className: string;
  formId: string;
}>;

export function StepFourController({
  pageId,
  form,
  formId,
  className,
}: StepFourControllerProps) {
  const {
    scoreValue,
    nonPresentStudents,
    allStudentsAverageScores,
    modules,
    getEvaluatedStudentsForSubSkill,
  } = useStepThreeState();

  /**
   * Generates a list of absent students names to display
   *
   * @description Saves ids instead of names in the form for validation.
   */
  const presenceMemo = useMemo(() => {
    let studentsPresence: DynamicItemTuple[] = Array.from(
      nonPresentStudents.entries(),
    ).map(([studentId, studentValues]) => {
      const firstValue = Array.isArray(studentValues)
        ? studentValues[0]
        : undefined;

      const studentName = typeof firstValue === "string" ? firstValue : "";

      const normalizedStudentId =
        typeof studentId === "string" ? studentId : String(studentId);

      return [studentName, { id: normalizedStudentId }];
    });

    let studentsPresenceIds = Array.from(nonPresentStudents.keys());
    if (studentsPresence.length === 0) {
      studentsPresence = [["Aucun", { id: "none" }]];
      studentsPresenceIds = ["none"];
    }

    form.setValue("absence", studentsPresenceIds);

    return studentsPresence;
  }, [nonPresentStudents, form]);

  return (
    <>
      <CardDescription>{"Les modules"}</CardDescription>
      <Accordion type="single" collapsible className={summaryPageContent}>
        {modules.length < 1 && (
          <Item>
            <Badge variant="outline" className="mx-auto">
              {"Aucun module n'a été évalué"}
            </Badge>
          </Item>
        )}
        {modules.length > 0 && (
          <ListMapper items={modules}>
            {(module) => {
              return (
                <AccordionItem key={module.id} value={module.id}>
                  <AccordionTrigger>{module.name}</AccordionTrigger>
                  <AccordionContent>
                    <ListMapper items={Array.from(module.subSkills.values())}>
                      {(subSkill) => {
                        if (subSkill.isCompleted && !subSkill.isDisabled) {
                          return (
                            <div
                              key={subSkill.id}
                              // id={subSkill.id}
                              className=" m-auto max-w-5/6"
                            >
                              <ItemTitle>{subSkill.name}</ItemTitle>
                              <EvaluationSliderList
                                items={getEvaluatedStudentsForSubSkill(
                                  subSkill.id,
                                  module.id,
                                )}
                                optional={(student) => {
                                  const value = scoreValue(
                                    student.id,
                                    subSkill.id,
                                    module.id,
                                  );
                                  return { value };
                                }}
                                inert
                              />
                            </div>
                          );
                        }
                      }}
                    </ListMapper>
                  </AccordionContent>
                </AccordionItem>
              );
            }}
          </ListMapper>
        )}
      </Accordion>
      <form id={formId} className={className}>
        <Item>
          <ItemContent>
            <ItemTitle>{"Note globale des élèves"}</ItemTitle>
            <ItemDescription>
              {"Moyenne générale des notes pour chaque élève évalué(e)."}
            </ItemDescription>
            {allStudentsAverageScores.size < 1 && (
              <Item>
                <Badge variant="outline" className="mx-auto">
                  {"Aucun élève évalué"}
                </Badge>
              </Item>
            )}
            <ItemContent className="m-6">
              {allStudentsAverageScores.size > 0 && (
                <LabelledScoreInputList
                  items={Array.from(allStudentsAverageScores.entries())}
                  form={form}
                  optional={(tuple) => {
                    return {
                      id: tuple[0],
                      item: tuple[1],
                    };
                  }}
                />
              )}
            </ItemContent>
          </ItemContent>
        </Item>
        <ControlledDynamicTagList
          form={form}
          // {...sharedCallbacksMemo.commonObsProps}
          // {...controllers.dynamicListControllers}
          name="absence"
          pageId={pageId}
          title={"Elèves absents aujourd'hui"}
          itemList={presenceMemo}
          inert
          displayCRUD={false}
          // onRemove={handleDeletingTask}
        />
        <ControlledLabelledTextArea
          form={form}
          name="comments"
          title="Commentaires"
        />
      </form>
    </>
  );
}
