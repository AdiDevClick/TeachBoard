import type { StudentWithPresence } from "@/api/store/types/steps-creation-store.types.ts";

/**
 * Props for EvaluationSlider component.
 *
 * {@link import("@/components/Sliders/EvaluationSlider.tsx").EvaluationSlider}
 */
export type EvaluationSliderProps = Readonly<
  {
    /** Current evaluation value as an array of numbers */
    evaluation: number[];
    /** Handler for when the slider value changes */
    onValueChange: (value: number[]) => void;
  } & Pick<StudentWithPresence, "fullName">
>;
