import { useEvaluationStepsCreationStore } from "@/api/store/EvaluationStepsCreationStore.ts";
import "@/assets/css/Slider.scss";
import { ListMapper } from "@/components/Lists/ListMapper.tsx";
import type { EvaluationRadioItemProps } from "@/components/Radio/types/radio.types.ts";
import { Badge } from "@/components/ui/badge.tsx";
import { Item } from "@/components/ui/item.tsx";
import { Slider } from "@/components/ui/slider.tsx";
import {
  debugLogs,
  stepThreeControllerPropsInvalid,
} from "@/configs/app-components.config.ts";
import type { StepThreeControllerProps } from "@/pages/Evaluations/create/steps/three/types/step-three.types.ts";
import { useState, type CSSProperties, type MouseEvent } from "react";

export function StepThreeStudentsEvaluationController(
  props: StepThreeControllerProps,
) {
  const { formId, students } = props;
  const [value, setValue] = useState([0]);

  if (stepThreeControllerPropsInvalid(props)) {
    debugLogs("StepThreeStudentsEvaluationController", props);
    // return null;
  }

  const handleOnClick = (
    e: MouseEvent<HTMLDivElement>,
    props: EvaluationRadioItemProps,
  ) => {
    const selectedStudent = presentStudentsWithAssignedTasks[props.index];
    console.log("Clicked item:", props);
    console.log("event :", e);
    console.log("student : ", selectedStudent);
    // setModuleSelection({
    //   isClicked: true,
    //   selectedModuleIndex: props.index,
    //   selectedModule: selectedModule,
    // });
  };
  console.log(students);
  return (
    <form id={formId} className="min-w-md">
      <ListMapper items={students}>
        {(student) => (
          <Item className="flex flex-nowrap gap-0.1">
            <Badge className="m-4">{student.fullName}</Badge>
            <Slider
              step={25}
              value={value}
              onValueChange={setValue}
              className="four-steps-slider"
              style={
                {
                  "--slider-rangeColor": rangeColor(value[0]),
                } as CSSProperties
              }
            />
          </Item>
        )}
      </ListMapper>
    </form>
  );
}

/**
 * Get color based on value range.
 *
 * @param value - The numeric value to evaluate.
 * @returns The corresponding color as a string.
 */
function rangeColor(value: number) {
  const red = "#e53935";
  const yellow = "#f9a825";
  const lightGreen = "#7cb342";
  const green = "#2e7d32";
  const white = "#ffffff";

  if (value === 25) return red;
  if (value === 50) return yellow;
  if (value === 75) return lightGreen;
  if (value === 100) return green;

  return white;
}
