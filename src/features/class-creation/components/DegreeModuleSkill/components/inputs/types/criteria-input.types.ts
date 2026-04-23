import type { Slider } from "@radix-ui/react-slider";
import type { ChangeEvent, ComponentPropsWithoutRef } from "react";

/**
 * Props for the CriteriaInput component
 */
export type CriteriaInputProps = Readonly<
  {
    /** The index of the criteria in the list, used for labeling and removal. */
    index: number;
    /** The label for the remove button, used for accessibility. */
    removeButtonLabel: string;
    /** A function to remove this criteria from the list, called with the index when the remove button is clicked. */
    remove: (index: number) => void;
    /** An array of numbers representing the predefined score steps for each criteria, used to set the default value of the slider. */
    scoreSteps: ReadonlyArray<number>;
    /** The current score value for this criteria, which will be clamped between 0 and 100 and displayed in the title. */
    value: number;
    /** A callback function that is called when the slider value changes, receiving the new score value as an argument. */
    onValueChange?: (nextScore: number) => void;
    /** A callback function that is called when the input value changes, receiving the change event as an argument. */
    onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  } & Omit<
    ComponentPropsWithoutRef<typeof Slider>,
    "value" | "defaultValue" | "onValueChange" | "onChange"
  >
>;
