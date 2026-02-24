import withListMapper from "@/components/HOCs/withListMapper";
import { SubSkillWithStudents } from "@/features/evaluations/create/components/Accordion/SubSkillWithStudents";
import { withAccordionItem } from "@/features/evaluations/create/components/HOCs/withAccordionItem";
import { createComponentName } from "@/utils/utils";
/**
 * @fileoverview Exports the SubSkillWithStudentsList component, which is a list of SubSkillWithStudents components wrapped with the withListMapper HOC.
 */

/**
 * A version of the SubSkillWithStudents component that can be used to display a list of sub-skills with their associated students.
 *
 * @exports SubSkillWithStudentsList - A list of SubSkillWithStudents components.
 */
export const SubSkillWithStudentsList = withListMapper(SubSkillWithStudents);
createComponentName(
  "withListMapper",
  "SubSkillWithStudentsList",
  SubSkillWithStudentsList,
);

/**
 * An accordion item that contains a subskill whose displays a list of students and their slider score.
 */
export const AccordionItemWithSubSkillWithStudents = withAccordionItem(
  SubSkillWithStudentsList,
);
createComponentName(
  "withAccordionItem",
  "AccordionItemWithSubSkillWithStudents",
  AccordionItemWithSubSkillWithStudents,
);

/**
 * A list of acordion items that for each item, contains a subskill whose displays a list of students and their slider score.
 */
export const AccordionItemWithSubSkillWithStudentsList = withListMapper(
  AccordionItemWithSubSkillWithStudents,
);
createComponentName(
  "withListMapper",
  "AccordionItemWithSubSkillWithStudentsList",
  AccordionItemWithSubSkillWithStudentsList,
);
