import { lazyImport } from "@/utils/utils";

/**
 * @fileoverview Exports for evaluation edit components
 * @description This file exports the evaluation edit components, applying necessary HOCs for enhanced functionality.
 */

/**
 * Lazy-loaded version of EvaluationEdit component for code-splitting and performance optimization
 */
export const LazyEvaluationEdit = lazyImport(
  "@/features/evaluations/edit/EvaluationEdit",
  "EvaluationEdit",
);
