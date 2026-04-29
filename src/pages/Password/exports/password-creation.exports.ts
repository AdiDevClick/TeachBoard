import { lazyImport } from "@/utils/utils";

/**
 * @fileoverview Exports for password creation components
 */

/**
 * Lazy-loaded version of PasswordCreation component for code-splitting and performance optimization
 */
export const LazyPasswordCreation = lazyImport(
  "@/pages/Password/PasswordCreation",
  "PasswordCreation",
);
