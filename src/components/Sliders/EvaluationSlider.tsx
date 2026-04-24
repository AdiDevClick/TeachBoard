import "@/assets/css/Slider.scss";
import { withToolTip } from "@/components/HOCs/withToolTip";
import {
  buildSliderHoverZones,
  sliderRangeColor,
} from "@/components/Sliders/functions/sliders.functions.ts";
import type { EvaluationSliderProps } from "@/components/Sliders/types/sliders.types.ts";
import { Badge } from "@/components/ui/badge.tsx";
import { Item } from "@/components/ui/item.tsx";
import { Slider } from "@/components/ui/slider.tsx";
import {
  debugLogs,
  evaluationSliderPropsValid,
} from "@/configs/app-components.config.ts";
import sanitizeDOMProps from "@/utils/props";
import { cn } from "@/utils/utils";
import {
  evaluationStudentBadge,
  evaluationStudentContainer,
  evaluationStudentSlider,
} from "@css/EvaluationStudent.module.scss";
import {
  useEffect,
  useEffectEvent,
  useMemo,
  useState,
  type ComponentProps,
  type CSSProperties,
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

  const hoverZones = useMemo(() => buildSliderHoverZones(criteria), [criteria]);
  const visibleHoverZones =
    hoverZones.length > 0
      ? hoverZones
      : [
          {
            id,
            score: internalValue[0] ?? 0,
            criterion: fullName,
            left: 0,
            width: 100,
          },
        ];

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
      <div className="basis-full min-w-0 w-full pt-6">
        <div className="relative w-full">
          <div
            aria-hidden="true"
            className="absolute inset-x-0 -top-6 h-5"
            data-slot="slider-hover-zones"
          >
            {visibleHoverZones.map((zone) => (
              <SliderHoverZoneWithTooltip
                key={zone.id}
                toolTipText={zone.criterion}
                className="absolute top-0 h-full opacity-0"
                data-slot="slider-hover-zone"
                style={{
                  left: `${zone.left}%`,
                  width: `${zone.width}%`,
                }}
              />
            ))}
          </div>
          <Slider
            step={25}
            value={internalValue}
            className={cn(evaluationStudentSlider, "w-full")}
            style={
              {
                "--slider-rangeColor": sliderRangeColor(internalValue[0]),
              } as CSSProperties
            }
            {...safeSliderProps}
            onValueChange={handleValueChange}
          />
        </div>
      </div>
    </Item>
  );
}

type SliderHoverZoneProps = ComponentProps<"button">;

const SliderHoverZone = ({ className, ...props }: SliderHoverZoneProps) => (
  <button
    type="button"
    aria-hidden="true"
    tabIndex={-1}
    className={cn("rounded-sm border-0 bg-transparent p-0", className)}
    {...props}
  />
);

SliderHoverZone.displayName = "SliderHoverZone";

const SliderHoverZoneWithTooltip = withToolTip(SliderHoverZone);
