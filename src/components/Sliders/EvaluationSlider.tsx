import "@/assets/css/Slider.scss";
import { withToolTip } from "@/components/HOCs/withToolTip";
import { sliderRangeColor } from "@/components/Sliders/functions/sliders.functions.ts";
import type { EvaluationSliderProps } from "@/components/Sliders/types/sliders.types.ts";
import { Badge } from "@/components/ui/badge.tsx";
import { Button } from "@/components/ui/button";
import { Item } from "@/components/ui/item.tsx";
import { Slider } from "@/components/ui/slider.tsx";
import {
  debugLogs,
  evaluationSliderPropsValid,
} from "@/configs/app-components.config.ts";
import sanitizeDOMProps from "@/utils/props";
import { cn, preventDefaultAndStopPropagation } from "@/utils/utils";
import {
  evaluationStudentBadge,
  evaluationStudentContainer,
  evaluationStudentSlider,
} from "@css/EvaluationStudent.module.scss";
import {
  useEffect,
  useEffectEvent,
  useRef,
  useState,
  type BaseSyntheticEvent,
  type ComponentType,
  type CSSProperties,
  type PointerEventHandler,
} from "react";

/**
 * EvaluationSlider component for evaluating students.
 *
 * @param value - Current evaluation value as an array of numbers.
 * @param onValueChange - Handler for when the slider value changes.
 * @param fullName - Full name of the student.
 */
export function EvaluationSlider(props: EvaluationSliderProps) {
  const { fullName, onValueChange, value, id, criteria, ...rest } = props;
  const safeSliderProps = sanitizeDOMProps(rest, [
    "isPresent",
    "assignedTask",
    "overallScore",
    "originalScore",
  ]);

  const [internalValue, setInternalValue] = useState<number[]>(value ?? [0]);
  const sliderRef = useRef<HTMLSpanElement>(null);

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

  /**
   * Forwards pointer down events from the hover zones to the slider to trigger the slider's native tooltip and guidance features.
   *
   * @param event - The pointer event from the hover zone.
   */
  const forwardZonePointerDownToSlider: PointerEventHandler<
    HTMLButtonElement
  > = (event) => {
    preventDefaultAndStopPropagation(event);

    sliderRef.current?.dispatchEvent(
      new globalThis.PointerEvent("pointerdown", {
        ...(event as BaseSyntheticEvent),
      }),
    );
  };

  if (evaluationSliderPropsValid(props)) {
    debugLogs("[EvaluationSlider]", { type: "propsValidation", props });
    return null;
  }

  return (
    <Item
      data-slot="evaluation-student"
      data-student-id={id}
      className={evaluationStudentContainer}
    >
      <Badge className={evaluationStudentBadge}>{fullName}</Badge>
      <div className="relative w-full max-w-2/3">
        <div
          className="absolute inset-0 flex items-center justify-between"
          // className="absolute -inset-x-2 -inset-y-0 flex items-center justify-between"
          data-slot="slider-hover-zones"
        >
          {criteria?.map((zone) => (
            <SliderHoverZoneWithTooltip
              type="button"
              key={zone.id}
              toolTipText={zone.criterion}
              data-slot="slider-hover-zone"
              onPointerDown={forwardZonePointerDownToSlider}
              className={cn(
                "z-1 size-2 rounded-full p-2 group border-border/50 bg-background/70 text-foreground/70 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.35)] transition-[transform,background-color,border-color,box-shadow] duration-200 hover:scale-125 hover:border-primary/40 hover:bg-primary/70 hover:text-primary-foreground hover:shadow-[0_0_0_4px_rgba(var(--primary),0.08)]",
              )}
              // className={cn("rounded-sm border-0 bg-transparent p-0", className)}
              {...props}
            />
          ))}
        </div>
        <Slider
          ref={sliderRef}
          step={25}
          value={internalValue}
          className={cn(evaluationStudentSlider, "min-w-full")}
          style={
            {
              "--slider-rangeColor": sliderRangeColor(internalValue[0]),
            } as CSSProperties
          }
          {...safeSliderProps}
          onValueChange={handleValueChange}
        />
      </div>
    </Item>
  );
}

const SliderHoverZoneWithTooltip: ComponentType<
  Record<string, unknown> & { toolTipText: string }
> = withToolTip(Button);
