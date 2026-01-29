import { useEvaluationStepsCreationStore } from "@/api/store/EvaluationStepsCreationStore.ts";
import { ListMapper } from "@/components/Lists/ListMapper.tsx";
import { EvaluationSlider } from "@/components/Sliders/EvaluationSlider.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import {
  debugLogs,
  stepThreeControllerPropsInvalid,
} from "@/configs/app-components.config.ts";
import type { StepThreeControllerProps } from "@/pages/Evaluations/create/steps/three/types/step-three.types.ts";
import { useEffect, useState } from "react";
import { useShallow } from "zustand/shallow";

export function StepThreeStudentsEvaluationController(
  props: StepThreeControllerProps,
) {
  const { formId, students } = props;
  const selectedSubSkill = useEvaluationStepsCreationStore(
    useShallow((state) => state.getSelectedSubSkill()),
  );
  const selectedModule = useEvaluationStepsCreationStore(
    useShallow((state) => state.getSelectedModule()),
  );
  const setEvaluationForStudent = useEvaluationStepsCreationStore(
    (state) => state.setEvaluationForStudent,
  );
  const isThisSubSkillCompleted = useEvaluationStepsCreationStore(
    (state) => state.isThisSubSkillCompleted,
  );
  const setSubSkillHasCompleted = useEvaluationStepsCreationStore(
    (state) => state.setSubSkillHasCompleted,
  );
  const [value, setValue] = useState([0]);

  if (stepThreeControllerPropsInvalid(props)) {
    debugLogs("StepThreeStudentsEvaluationController", props);
  }

  /**
   * Effect to check if the selected sub-skill is completed.
   *
   * @description - This effect runs whenever a user changes the slider value.
   */
  useEffect(() => {
    if (!selectedModule || !selectedSubSkill) {
      return;
    }

    const isCompleted = isThisSubSkillCompleted(
      selectedSubSkill.id,
      selectedModule.id,
    );

    if (selectedSubSkill.isCompleted !== isCompleted) {
      setSubSkillHasCompleted(
        selectedModule.id,
        selectedSubSkill.id,
        isCompleted,
      );
    }
  }, [selectedModule, selectedSubSkill, value]);

  /**
   * Handles value change for a student's evaluation.
   * 
   * @description Updates the evaluation score for the specified student

  * @param newValue - The new value array from the slider. 
   * @param student - The student whose evaluation is being updated.
   */
  const handleValueChange = (
    newValue: number[],
    student: (typeof students)[number],
  ) => {
    setEvaluationForStudent(student.id, {
      subSkill: selectedSubSkill ?? null,
      score: newValue[0],
      module: selectedModule ?? null,
    });
    setValue(newValue);
  };

  return (
    <form id={formId} className="min-w-md">
      <ListMapper items={students}>
        {(student) => {
          let evaluation = value;
          const moduleId = selectedModule?.id;
          const subSkillId = selectedSubSkill?.id;
          const studentModules = student.evaluations?.modules;

          if (moduleId && subSkillId && studentModules?.has(moduleId)) {
            const subSkill = studentModules
              .get(moduleId)
              ?.subSkills.get(subSkillId);

            evaluation = subSkill?.score ? [subSkill.score] : value;
          }
          return (
            <EvaluationSlider
              fullName={student.fullName}
              evaluation={evaluation}
              onValueChange={(e) => handleValueChange(e, student)}
            />
          );
        }}
      </ListMapper>
      {students.length === 0 && (
        <Badge variant={"outline"} className="mx-auto">
          Aucuns étudiants spécifiés pour cette compétence.
        </Badge>
      )}
    </form>
  );
}
