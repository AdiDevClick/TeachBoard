import { lazyImport } from "@/utils/utils";

/**
 * @fileoverview Exports for evaluation view components
 * @description This file exports the evaluation view components, applying necessary HOCs for enhanced functionality.
 */

/**
 * Lazy-loaded version of EvaluationsView component for code-splitting and performance optimization
 */
export const LazyEvaluationsView = lazyImport(
  "@/features/evaluations/full-view/EvaluationsView",
  "EvaluationsView",
);

/**
 * Lazy-loaded version of EvaluationDetailDrawerRoute component for code-splitting and performance optimization
 */
export const LazyEvaluationDetailDrawerRoute = lazyImport(
  "@/features/evaluations/preview-view/EvaluationDrawerRoute",
  "EvaluationDetailDrawerRoute",
);
