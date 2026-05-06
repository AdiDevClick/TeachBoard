import { lazyImport } from "@/utils/utils";

/**
 * @fileoverview Exports for evaluation list components
 * @description This file exports the evaluation list components, applying necessary HOCs for enhanced functionality.
 */

/**
 * Lazy-loaded version of EvaluationsList component for code-splitting and performance optimization
 */
export const LazyEvaluationsList = lazyImport(
  "@/features/evaluations/listing-view/EvaluationsList",
  "EvaluationsList",
);
