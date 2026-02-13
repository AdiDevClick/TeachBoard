import { EvaluationSliderList } from "@/components/Sliders/exports/sliders.exports";
import { ItemHeader } from "@/components/ui/item";
import {
  debugLogs,
  subSkillWithStudentsPropsInvalid,
} from "@/configs/app-components.config";
import type { SubSkillWithStudentsProps } from "@/features/evaluations/create/components/Accordion/types/subskill-with-students.types";

/**
 * Component that displays a subskill with its associated students and their slider scores.
 *
 * @param module - The module to which the subskill belongs, used for contextualizing the students list.
 * @param storeGetter - A function that retrieves the list of students associated with a given subskill and module.
 * @param valueGetter - A function that retrieves the score value for a given student, subskill, and module.
 * @param index - The index of the subskill in the list, used for alternating background colors.
 * @param color1 - The first background color option for the subskill card.
 * @param color2 - The second background color option for the subskill card.
 *
 * @returns A React component that displays a subskill with its associated students and their slider scores, styled with alternating background colors based on the index.
 */
export function SubSkillWithStudents(props: SubSkillWithStudentsProps) {
  if (subSkillWithStudentsPropsInvalid(props)) {
    debugLogs("SubSkillWithStudents", props);
    return null;
  }
  const {
    storeGetter,
    module,
    valueGetter,
    index,
    color1 = "bg-blue-50",
    color2 = "bg-green-50",
    ...subSkill
  } = props;
  const { isCompleted, isDisabled } = subSkill;

  const shouldDisplaySubSkill = isCompleted && !isDisabled;

  if (!shouldDisplaySubSkill) {
    return null;
  }

  const colorSelector = index % 2 === 0 ? color1 : color2;

  return (
    <div
      key={subSkill.id}
      className={`mx-auto rounded-xl border m-2 ${colorSelector} p-3`}
    >
      <ItemHeader className="m-2">{subSkill.name}</ItemHeader>
      <EvaluationSliderList
        items={storeGetter(subSkill.id, module.id)}
        optional={(student) => {
          const value = valueGetter(student.id, subSkill.id, module.id);
          return { value };
        }}
        inert
      />
    </div>
  );
}
