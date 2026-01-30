import "@/assets/css/Slider.scss";
import { sliderRangeColor } from "@/components/Sliders/functions/sliders.functions.ts";
import type { EvaluationSliderProps } from "@/components/Sliders/types/sliders.types.ts";
import { Badge } from "@/components/ui/badge.tsx";
import { Item } from "@/components/ui/item.tsx";
import { Slider } from "@/components/ui/slider.tsx";
import {
  debugLogs,
  evaluationSliderPropsValid,
} from "@/configs/app-components.config.ts";
import type { CSSProperties } from "react";

export function EvaluationSlider(props: EvaluationSliderProps) {
  if (!evaluationSliderPropsValid(props)) {
    debugLogs("EvaluationSlider", props);
    return null;
  }

  const { fullName, evaluation, onValueChange } = props;

  return (
    <Item className="flex flex-nowrap gap-0.1">
      <Badge className="m-4">{fullName}</Badge>
      <Slider
        step={25}
        value={evaluation}
        onValueChange={onValueChange}
        className="four-steps-slider"
        style={
          {
            "--slider-rangeColor": sliderRangeColor(evaluation[0]),
          } as CSSProperties
        }
      />
    </Item>
  );
}
