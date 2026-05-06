import { Accordion } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Item, ItemTitle } from "@/components/ui/item";
import type { ClassModules } from "@/features/evaluations/create/store/types/steps-creation-store.types";
import { AccordionItemWithSubSkillWithStudentsList } from "@/features/evaluations/main/components/Accordion/exports/accordion.export";
import type { LabelledAccordionProps } from "@/features/evaluations/main/components/Accordion/types/labelled-accordion.types";

/**
 * Labelled Accordion Component - STEP 4 (Summary)
 *
 * @description This renders an accordion with a label
 * @param inputController - The input controller for the accordion, containing configuration such as title, placeholder, colors, etc.
 * @param accordionItems - The list of modules to be displayed in the accordion, each containing sub-skills and evaluated students.
 * @param storeGetter - A function to retrieve the list of evaluated students for a given sub-skill, used to populate the accordion items with the relevant data.
 * @param valueGetter - A function to retrieve the score value for a given student and sub-skill, used to display the scores in the accordion items.
 */
export function LabelledAccordion(props: LabelledAccordionProps) {
  const { inputController, accordionItems, storeGetter, valueGetter } = props;
  const { title, placeholder, color1, color2 } = inputController;

  /**
   * Prepares the optional prop for the AccordionItem, which includes the list of sub-skills and the module information.
   *
   * @param module - The module for which to prepare the optional prop (easier to retrieve in the AccordionItem).
   *
   * @returns An object containing the list of sub-skills and the module information to be passed as optional prop to the AccordionItem.
   */
  const modulesOptional = (module: ClassModules) => {
    const items = Array.isArray(module.subSkills)
      ? module.subSkills
      : Array.from(module.subSkills?.values?.() ?? []);
    return {
      items,
      module,
    };
  };

  return (
    <Item className="grid gap-(--app-overall-gap) p-0">
      <ItemTitle>{title}</ItemTitle>
      <Accordion {...inputController}>
        {accordionItems.length < 1 && (
          <Item>
            <Badge variant="outline" className="mx-auto">
              {placeholder}
            </Badge>
          </Item>
        )}
        {accordionItems.length > 0 && (
          <AccordionItemWithSubSkillWithStudentsList
            items={accordionItems}
            optional={modulesOptional}
            color1={color1}
            color2={color2}
            storeGetter={storeGetter}
            valueGetter={valueGetter}
          />
        )}
      </Accordion>
    </Item>
  );
}
