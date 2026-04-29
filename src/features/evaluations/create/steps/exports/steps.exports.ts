import { lazyImport } from "@/utils/utils";

/**
 * @fileoverview Exports for evaluation creation steps components
 * @description This file exports the components for each step of the evaluation creation process, applying necessary HOCs for enhanced functionality.
 */

/**
 * Lazy-loaded versions of step One components for code-splitting and performance optimization
 */
export const LazyStepOne = lazyImport(
  "@/features/evaluations/create/steps/one/StepOne",
  "StepOne",
);

/**
 * Lazy-loaded versions of step Two components for code-splitting and performance optimization
 */
export const LazyStepTwo = lazyImport(
  "@/features/evaluations/create/steps/two/StepTwo",
  "StepTwo",
);

/**
 * Lazy-loaded versions of step Three components for code-splitting and performance optimization
 */
export const LazyStepThree = lazyImport(
  "@/features/evaluations/create/steps/three/StepThree",
  "StepThree",
);

/**
 * Lazy-loaded versions of step Four components for code-splitting and performance optimization
 */
export const LazyStepFour = lazyImport(
  "@/features/evaluations/create/steps/four/StepFour",
  "StepFour",
);
