import { lazyImport } from "@/utils/utils";

/**
 * @fileoverview Exports for evaluation delete components
 * @description This file exports the evaluation delete components, applying necessary HOCs for enhanced functionality.
 */

/**
 * Lazy-loaded version of EvaluationDelete component for code-splitting and performance optimization
 */
export const LazyEvaluationDelete = lazyImport(
  "@/features/evaluations/delete/EvaluationDelete",
  "EvaluationDelete",
);
