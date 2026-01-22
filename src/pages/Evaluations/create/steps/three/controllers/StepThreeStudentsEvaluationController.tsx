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
  const { formId, modules } = props;
  const [value, setValue] = useState([0]);

  const setModuleSelection = useEvaluationStepsCreationStore(
    (state) => state.setModuleSelection,
  );

  if (stepThreeControllerPropsInvalid(props)) {
    debugLogs("StepThreeStudentsEvaluationController", props);
    // return null;
  }

  const handleOnClick = (
    e: MouseEvent<HTMLDivElement>,
    props: EvaluationRadioItemProps,
  ) => {
    const selectedModule = modules[props.index];
    console.log("Clicked item:", props);
    console.log("event :", e);
    console.log("module : ", selectedModule);
    // setModuleSelection({
    //   isClicked: true,
    //   selectedModuleIndex: props.index,
    //   selectedModule: selectedModule,
    // });
  };

  const rangeColor = () => {
    if (value[0] === 25) return "#e53935";
    if (value[0] === 50) return "#f9a825";
    if (value[0] === 75) return "#7cb342";
    if (value[0] === 100) return "#2e7d32";
    return "#ffffff";
  };

  return (
    <form id={formId} className="min-w-md">
      <ListMapper items={modules}>
        <Item className="flex flex-nowrap gap-0.1">
          <Badge className="m-4">Test Badge</Badge>
          <Slider
            step={25}
            value={value}
            onValueChange={setValue}
            className="four-steps-slider"
            style={
              {
                "--slider-rangeColor": rangeColor(),
              } as CSSProperties
            }
          />
        </Item>
      </ListMapper>
    </form>
  );
}
