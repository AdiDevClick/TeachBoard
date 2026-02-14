import { summaryPageContent } from "@/assets/css/SummaryPage.module.scss";
import { ControlledDynamicTagList } from "@/components/Tags/exports/dynamic-tags.exports";
import type { DynamicItemTuple } from "@/components/Tags/types/tags.types";
import { ControlledLabelledTextArea } from "@/components/TextAreas/exports/labelled-textarea";
import { Accordion } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { CardDescription } from "@/components/ui/card";
import { Item } from "@/components/ui/item";
import { ACCORDION_CONFIGS } from "@/features/evaluations/create/components/Accordion/config/accordion.configs";
import { AccordionItemWithSubSkillWithStudentsList } from "@/features/evaluations/create/components/Accordion/exports/accordion.export";
import { AverageFields } from "@/features/evaluations/create/components/Score/AverageFields";
import { useStepThreeState } from "@/features/evaluations/create/hooks/useStepThreeState";
import type { ClassModules } from "@/features/evaluations/create/store/types/steps-creation-store.types";
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

  /**
   * Prepares the optional prop for the AccordionItem, which includes the list of sub-skills and the module information.
   *
   * @param module -
   * @returns
   */
  const modulesOptional = (module: ClassModules) => ({
    items: Array.from(module.subSkills.values()),
    module,
  });

  return (
    <>
      <CardDescription>{ACCORDION_CONFIGS.title}</CardDescription>
      <Accordion type="single" collapsible className={summaryPageContent}>
        {modules.length < 1 && (
          <Item>
            <Badge variant="outline" className="mx-auto">
              {ACCORDION_CONFIGS.noModulesText}
            </Badge>
          </Item>
        )}
        {modules.length > 0 && (
          <AccordionItemWithSubSkillWithStudentsList
            items={modules}
            optional={modulesOptional}
            color1={ACCORDION_CONFIGS.color1}
            color2={ACCORDION_CONFIGS.color2}
            storeGetter={getEvaluatedStudentsForSubSkill}
            valueGetter={scoreValue}
          />
        )}
      </Accordion>
      <form id={formId} className={className}>
        <AverageFields form={form} students={allStudentsAverageScores} />
        <ControlledDynamicTagList
          form={form}
          name="absence"
          pageId={pageId}
          title={"Elèves absents aujourd'hui"}
          itemList={presenceMemo}
          inert
          displayCRUD={false}
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
