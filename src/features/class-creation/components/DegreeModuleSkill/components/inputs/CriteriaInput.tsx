import { evaluationStudentSlider } from "@/assets/css/EvaluationStudent.module.scss";
import { sliderRangeColor } from "@/components/Sliders/functions/sliders.functions";
import { Button } from "@/components/ui/button";
import { FieldTitle } from "@/components/ui/field";
import { ItemActions } from "@/components/ui/item";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { clampScore } from "@/features/class-creation/components/DegreeModuleSkill/components/inputs/functions/criteria-input.functions";
import type { CriteriaInputProps } from "@/features/class-creation/components/DegreeModuleSkill/components/inputs/types/criteria-input.types";
import sanitizeDOMProps from "@/utils/props";
import { preventDefaultAndStopPropagation } from "@/utils/utils";
import { XIcon } from "lucide-react";
import type { CSSProperties } from "react";

/**
 * Component for rendering a criteria input with a slider to select a score and a button to remove the criteria.
 *
 * @param index - The index of the criteria in the list, used for labeling and removal.
 * @param removeButtonLabel - The label for the remove button, used for accessibility.
 * @param remove - A function to remove this criteria from the list, called with the index when the remove button is clicked.
 * @param scoreSteps - An array of numbers representing the predefined score steps for each criteria, used to set the default value of the slider.
 * @param value - The current score value for this criteria, which will be clamped between 0 and 100 and displayed in the title.
 * @param onValueChange - A callback function that is called when the slider value changes, receiving the new score value as an argument.
 * @param props - Additional props to pass to the Slider component, excluding name and control which are managed internally.
 */
export function CriteriaInput({
  index,
  removeButtonLabel,
  remove,
  value,
  onValueChange,
  ...props
}: CriteriaInputProps) {
  const { onChange: ignoredOnChange, ...sliderProps } = props;
  const currentScore = clampScore(value ?? 0);

  const safeSliderProps = sanitizeDOMProps(sliderProps, [
    "fieldState",
    "scoreSteps",
  ]);

  if (ignoredOnChange) {
    // Slider updates are normalized through onValueChange only.
  }

  const handleSliderValueChange = (nextValues: ReadonlyArray<number>) => {
    const [nextValue = 0] = nextValues;

    if (nextValue === currentScore) {
      return;
    }

    onValueChange?.(nextValue);
  };

  return (
    <>
      <div className="flex w-full justify-between">
        <FieldTitle>Palier {currentScore}/100</FieldTitle>
        <ItemActions>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={(e) => {
              preventDefaultAndStopPropagation(e);
              remove(index);
            }}
            aria-label={`${removeButtonLabel} ${index + 1}`}
          >
            <XIcon />
          </Button>
        </ItemActions>
      </div>
      <Slider
        value={[currentScore]}
        className={evaluationStudentSlider}
        style={
          {
            "--slider-rangeColor": sliderRangeColor(currentScore),
          } as CSSProperties
        }
        {...safeSliderProps}
        onValueChange={handleSliderValueChange}
        aria-label={`Palier de la justification ${index + 1}`}
      />
      <Separator className="my-2" />
    </>
  );
}
