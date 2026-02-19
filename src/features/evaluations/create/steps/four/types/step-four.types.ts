import type { STEP_FOUR_INPUT_CONTROLLERS } from "@/features/evaluations/create/steps/four/config/step-four.configs";
import type { PageWithControllers } from "@/types/AppPagesInterface";

/**
 * Step Four - Summary and Confirmation Component
 */
export type StepFourProps = Readonly<
  Omit<
    PageWithControllers<typeof STEP_FOUR_INPUT_CONTROLLERS>,
    "inputControllers"
  > & {
    inputControllers?: typeof STEP_FOUR_INPUT_CONTROLLERS;
  }
>;
