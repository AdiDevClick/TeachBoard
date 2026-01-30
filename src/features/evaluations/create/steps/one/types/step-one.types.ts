import type { StepOne } from "@/features/evaluations/create/steps/one/StepOne.tsx";
import type { AppControllerInterface } from "@/types/AppControllerInterface.ts";

/**
 * Props for StepOneController component
 */
export type StepOneControllerProps = AppControllerInterface &
  Omit<Parameters<typeof StepOne>[0], "modalMode">;
