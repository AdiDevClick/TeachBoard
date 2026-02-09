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
import { useEffect, useEffectEvent, useState, type CSSProperties } from "react";

/**
 * EvaluationSlider component for evaluating students.
 *
 * @param value - Current evaluation value as an array of numbers.
 * @param onValueChange - Handler for when the slider value changes.
 * @param fullName - Full name of the student.
 */
export function EvaluationSlider(props: EvaluationSliderProps) {
  const { fullName, onValueChange, value, ...rest } = props;

  const [internalValue, setInternalValue] = useState<number[]>(value ?? [0]);

  /**
   * Handles value change from the slider component.
   *
   * @description This is mainly to sync internal state with external changes using a controlled component pattern (triggering a re-render).
   *
   * @param newValue - The new value array from the slider.
   */
  const handleValueChange = (newValue: number[]) => {
    setInternalValue(newValue ?? internalValue);
    onValueChange?.(newValue, props);
  };

  /**
   * SYNC - External changes with internal state
   *
   * @description Make sure each slider is tided to its own value and not others sliders
   */
  const triggerExternalChange = useEffectEvent((value: number[]) => {
    setInternalValue(value ?? internalValue);
  });

  /**
   * SYNC - Internal state with external changes
   *
   * @description  Each time the value changes
   */
  useEffect(() => {
    triggerExternalChange(value);
  }, [value]);

  if (evaluationSliderPropsValid(props)) {
    debugLogs("[EvaluationSlider]", props);
    return null;
  }

  return (
    <Item className="flex flex-nowrap gap-0.1">
      <Badge className="m-4">{fullName}</Badge>
      <Slider
        step={25}
        value={internalValue}
        className="four-steps-slider"
        style={
          {
            "--slider-rangeColor": sliderRangeColor(internalValue[0]),
          } as CSSProperties
        }
        {...rest}
        onValueChange={handleValueChange}
      />
    </Item>
  );
}
