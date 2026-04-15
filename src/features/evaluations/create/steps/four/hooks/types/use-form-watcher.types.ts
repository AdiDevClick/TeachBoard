import type { StepFourFormSchema } from "@/features/evaluations/create/steps/four/models/step-four.models";
import type { UseFormReturn } from "react-hook-form";

/**
 * Props for the useFormWatchers hook
 */
export type UseFormWatchersProps = {
  form: UseFormReturn<StepFourFormSchema>;
};
