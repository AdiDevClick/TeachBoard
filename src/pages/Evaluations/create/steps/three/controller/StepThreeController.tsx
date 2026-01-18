import { EvaluationRadioItemList } from "@/components/Radio/EvaluationRadioItem.tsx";
import { RadioGroup } from "@/components/ui/radio-group.tsx";
import type { StepThreeControllerProps } from "@/pages/Evaluations/create/steps/three/types/step-three.types.ts";

export function StepThreeController({
  pageId,
  className,
  inputControllers = [],
  user,
  preparedStudentsTasksSelection,
  form,
  students,
  selectedClass,
  tasks,
  formId,
  modules,
}: StepThreeControllerProps) {
  console.log(tasks);
  return (
    <form id={formId}>
      <RadioGroup>
        <EvaluationRadioItemList items={modules} />
      </RadioGroup>
    </form>
  );
}
