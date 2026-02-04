import { summaryPageContent } from "@/assets/css/SummaryPage.module.scss";
import { ListMapper } from "@/components/Lists/ListMapper";
import { EvaluationSliderList } from "@/components/Sliders/EvaluationSlider";
import { ControlledDynamicTagList } from "@/components/Tags/DynamicTag";
import { ControlledLabelledTextArea } from "@/components/TextAreas/LabelledTextArea";
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
import { LabelledScoreInputList } from "@/features/evaluations/create/components/Score/LabelledScoreInput";
import { useEvaluationStepsCreationStore } from "@/features/evaluations/create/store/EvaluationStepsCreationStore";
import { useMemo, type ComponentProps } from "react";
import { useShallow } from "zustand/shallow";

type StepFourControllerProps = {
  pageId: string;
  form: ComponentProps<typeof ControlledDynamicTagList>["form"];
};

export function StepFourController({ pageId, form }: StepFourControllerProps) {
  const modules = useEvaluationStepsCreationStore(
    useShallow((state) => state.getAttendedModules()),
  );

  const getStudentScoreForSubSkill = useEvaluationStepsCreationStore(
    useShallow((state) => state.getStudentScoreForSubSkill),
  );

  const evaluatedStudentsForThisSubskill = useEvaluationStepsCreationStore(
    useShallow((state) => state.getPresentStudentsWithAssignedTasks),
  );

  const nonPresentStudents = useEvaluationStepsCreationStore(
    useShallow((state) => state.getAllNonPresentStudents()),
  );

  const allStudentsAverageScores = useEvaluationStepsCreationStore(
    useShallow((state) => state.getAllStudentsAverageScores()),
  );

  /**
   * Generates a list of absent students names to display
   *
   * @description Saves ids instead of names in the form for validation.
   */
  const presenceMemo = useMemo(() => {
    let studentsPresence = Array.from(nonPresentStudents.values());
    let studentsPresenceIds = Array.from(nonPresentStudents.keys());
    if (studentsPresence.length === 0) {
      studentsPresence = [["Aucun", {}]];
      studentsPresenceIds = ["none"];
    }

    form.setValue("absence", studentsPresenceIds);

    return studentsPresence;
  }, [nonPresentStudents]);

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
                        console.log("jai trigger un render de subskills");
                        if (subSkill.isCompleted && !subSkill.isDisabled) {
                          return (
                            <div
                              key={subSkill.id}
                              id={subSkill.id}
                              className=" m-auto max-w-5/6"
                            >
                              <ItemTitle>{subSkill.name}</ItemTitle>
                              <EvaluationSliderList
                                items={evaluatedStudentsForThisSubskill(
                                  subSkill.id,
                                )}
                                optional={(student) => {
                                  const value = getStudentScoreForSubSkill(
                                    student.id,
                                    subSkill.id,
                                    module.id,
                                  );
                                  return { value };
                                }}
                                inert
                                // onValueChange={handleValueChange}
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
      </Item>
      {/* <Item> */}
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
      {/* </Item> */}
      {/* <Item> */}
      <ControlledLabelledTextArea
        form={form}
        name="comments"
        title="Commentaires"
      />
      {/* </Item> */}
    </>
  );
}
