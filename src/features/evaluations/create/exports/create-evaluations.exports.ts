import { lazyImport } from "@/utils/utils";

/**
 * @fileoverview Exports for create evaluations components
 * @description This file exports the create evaluations components, applying necessary HOCs for enhanced functionality.
 */

/**
 * Lazy-loaded version of CreateEvaluations component for code-splitting and performance optimization
 */
export const LazyCreateEvaluations = lazyImport(
  "@/features/evaluations/create/CreateEvaluations",
  "CreateEvaluations",
);
