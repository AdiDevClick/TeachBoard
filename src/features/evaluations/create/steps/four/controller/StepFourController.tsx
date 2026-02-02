import { summaryPageContent } from "@/assets/css/SummaryPage.module.scss";
import { ListMapper } from "@/components/Lists/ListMapper";
import {
  EvaluationSlider,
  EvaluationSliderList,
} from "@/components/Sliders/EvaluationSlider";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Label } from "@/components/ui/label";
import { useEvaluationStepsCreationStore } from "@/features/evaluations/create/store/EvaluationStepsCreationStore";
import { useShallow } from "zustand/shallow";

export function StepFourController() {
  const modules = useEvaluationStepsCreationStore(
    useShallow((state) => state.getAttendedModules()),
  );

  const getStudentScoreForSubSkill = useEvaluationStepsCreationStore(
    useShallow((state) => state.getStudentScoreForSubSkill),
  );

  const evaluatedStudentsForThisSubskill = useEvaluationStepsCreationStore(
    useShallow((state) => state.getPresentStudentsWithAssignedTasks),
  );

  return (
    <Accordion
      type="single"
      collapsible
      // defaultValue="shipping"
      className={summaryPageContent}
    >
      <ListMapper items={modules}>
        {(module) => {
          console.log("THE CALLED module", module);
          return (
            <AccordionItem value={module.id}>
              <AccordionTrigger>{module.name}</AccordionTrigger>
              <AccordionContent>
                <ListMapper items={Array.from(module.subSkills.values())}>
                  {(subSkill) => {
                    if (subSkill.isCompleted && !subSkill.isDisabled) {
                      return (
                        <div key={subSkill.id} id={subSkill.id}>
                          <Label>{subSkill.name}</Label>
                          <EvaluationSliderList
                            items={evaluatedStudentsForThisSubskill(
                              subSkill.id,
                            )}
                            optional={(student) => {
                              return {
                                value: getStudentScoreForSubSkill(
                                  student.id,
                                  subSkill?.id,
                                  module?.id,
                                ),
                                inert: true,
                              };
                            }}
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
        <AccordionTrigger>How can I contact customer support?</AccordionTrigger>
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
  );
}
