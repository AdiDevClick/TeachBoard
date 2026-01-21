import { EvaluationRadioItemList } from "@/components/Radio/EvaluationRadioItem.tsx";
import type { EvaluationRadioItemProps } from "@/components/Radio/types/radio.types.ts";
import { RadioGroup } from "@/components/ui/radio-group.tsx";
import {
  debugLogs,
  stepThreeControllerPropsInvalid,
} from "@/configs/app-components.config.ts";
import type { StepThreeControllerProps } from "@/pages/Evaluations/create/steps/three/types/step-three.types.ts";
import type { MouseEvent } from "react";

export function StepThreeController(props: StepThreeControllerProps) {
  if (stepThreeControllerPropsInvalid(props)) {
    debugLogs("StepThreeController", props);
    return null;
  }

  const { formId, modules } = props;

  const handleOnClick = (
    e: MouseEvent<HTMLDivElement>,
    props: EvaluationRadioItemProps,
  ) => {
    const selectedModule = modules[props.index];
    console.log("Clicked item:", props);
    console.log("event :", e);
    console.log("module : ", selectedModule);
  };
  return (
    <form id={formId}>
      <RadioGroup>
        <EvaluationRadioItemList items={modules} itemClick={handleOnClick} />
      </RadioGroup>
    </form>
  );
}
