import type { StepFourController } from "@/features/evaluations/create/steps/four/controller/StepFourController";

/**
 * Props for the useStepFourHandler hook, derived from the parameters of the StepFourController component.
 */
export type UseStepFourHandlerProps = Pick<
  Parameters<typeof StepFourController>[0],
  "form" | "pageId"
>;
