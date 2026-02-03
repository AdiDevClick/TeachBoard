import type { Slider } from "@/components/ui/slider";
import type { StudentWithPresence } from "@/features/evaluations/create/store/types/steps-creation-store.types.ts";
import type { ComponentProps } from "react";

/**
 * Props for EvaluationSlider component.
 *
 * {@link import("@/components/Sliders/EvaluationSlider.tsx").EvaluationSlider}
 */
export type EvaluationSliderProps = Readonly<
  ComponentProps<typeof Slider> & {
    /** Current evaluation value as an array of numbers */
    value: number[];
    /** Handler for when the slider value changes */
    onValueChange?: (value: number[], props: EvaluationSliderProps) => void;
  } & Pick<StudentWithPresence, "fullName" | "id">
>;
