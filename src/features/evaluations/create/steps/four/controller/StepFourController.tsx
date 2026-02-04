import { ControlledLabelledInput } from "@/components/Inputs/LaballedInputForController";
import { ListMapper } from "@/components/Lists/ListMapper";
import {
  EvaluationSlider,
  EvaluationSliderList,
} from "@/components/Sliders/EvaluationSlider";
import { ControlledDynamicTagList } from "@/components/Tags/DynamicTag";
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
import { Textarea } from "@/components/ui/textarea";
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
      <Accordion type="single" collapsible className={"summaryPageContent"}>
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
        <AccordionItem value="shipping">
          <AccordionTrigger>What are your shipping options?</AccordionTrigger>
          <AccordionContent>
            <EvaluationSlider
              id={"Test zone 1"}
              fullName="Test zone 1"
              inert
              value={[25]}
            />
            <EvaluationSlider
              id={"Test zone 1"}
              fullName="Test zone 1"
              value={[25]}
            />
            <EvaluationSlider
              id={"Test zone 1"}
              fullName="Test zone 1"
              value={[25]}
            />
            <EvaluationSlider
              id={"Test zone 1"}
              fullName="Test zone 1"
              value={[25]}
            />
            {/* We offer standard (5-7 days), express (2-3 days), and overnight
          shipping. Free shipping on international orders. */}
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="returns">
          <AccordionTrigger>What is your return policy?</AccordionTrigger>
          <AccordionContent>
            <EvaluationSlider
              id={"Test zone 2"}
              fullName="Test zone 2"
              value={[75]}
              inert
            />
            <EvaluationSlider
              id={"Test zone 2"}
              fullName="Test zone 2"
              value={[75]}
            />
            <EvaluationSlider
              id={"Test zone 2"}
              fullName="Test zone 2"
              value={[75]}
            />
            <EvaluationSlider
              id={"Test zone 2"}
              fullName="Test zone 2"
              value={[75]}
            />
            {/* Returns accepted within 30 days. Items must be unused and in original
          packaging. Refunds processed within 5-7 business days. */}
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="support">
          <AccordionTrigger>
            How can I contact customer support?
          </AccordionTrigger>
          <AccordionContent>
            <EvaluationSlider
              id={"Test zone 3"}
              fullName="Test zone 3"
              value={[50]}
            />
            <EvaluationSlider
              id={"Test zone 3"}
              fullName="Test zone 3"
              value={[50]}
            />
            <EvaluationSlider
              id={"Test zone 3"}
              fullName="Test zone 3"
              value={[50]}
            />
            <EvaluationSlider
              id={"Test zone 3"}
              fullName="Test zone 3"
              value={[50]}
            />
            {/* Reach us via email, live chat, or phone. We respond within 24 hours
          during business days. */}
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="test">
          <AccordionTrigger>How can I test?</AccordionTrigger>
          <AccordionContent>
            <EvaluationSlider
              id={"Test zone 4"}
              fullName="Test zone 4"
              value={[50]}
            />
            <EvaluationSlider
              id={"Test zone 4"}
              fullName="Test zone 4"
              value={[50]}
            />
            <EvaluationSlider
              id={"Test zone 4"}
              fullName="Test zone 4"
              value={[50]}
            />
            <EvaluationSlider
              id={"Test zone 4"}
              fullName="Test zone 4"
              value={[50]}
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      {/* <CardDescription>{"Elèves absents"}</CardDescription> */}
      <Item>
        <ItemContent>
          <ItemTitle>{"Note globale des élèves"}</ItemTitle>
          <ItemDescription>
            {"Moyenne générale des notes pour chaque élève évalué(e)."}
          </ItemDescription>
          {Array.from(allStudentsAverageScores.entries()).map(
            ([studentId, studentDetails]) => {
              console.log(studentId, studentDetails);
              return (
                <div
                  key={studentId}
                  className="grid grid-cols-9 gap-2 justify-items-center items-center "
                >
                  <Badge className="m-4 justify-self-start col-start-1 col-end-6">
                    {studentDetails.name}
                  </Badge>
                  <p className="col-start-6 col-end-8">{"Moyenne : "}</p>
                  <ControlledLabelledInput
                    className="col-start-8 col-end-9"
                    name={studentId}
                    form={form}
                    defaultValue={studentDetails.score / 5}
                    // value={averageScore[0] / 5}
                  />
                  <p className="col-start-9">{"/20"}</p>
                </div>
              );
            },
          )}
        </ItemContent>
      </Item>
      <Item>
        <ControlledDynamicTagList
          form={form}
          // {...sharedCallbacksMemo.commonObsProps}
          // {...controllers.dynamicListControllers}
          name="step-four-controller"
          pageId={pageId}
          title={"Elèves absents aujourd'hui"}
          itemList={presenceMemo}
          inert
          displayCRUD={false}
          // onRemove={handleDeletingTask}
        />
      </Item>
      <Item>
        <ItemContent>
          <ItemTitle>{"Observations"}</ItemTitle>
          <Textarea />
        </ItemContent>
      </Item>
    </>
  );
}
