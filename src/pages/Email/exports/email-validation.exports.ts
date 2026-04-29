import { lazyImport } from "@/utils/utils";

/**
 * @fileoverview Exports for email validation components
 */

/**
 * Lazy-loaded version of EmailValidation component for code-splitting and performance optimization
 */
export const LazyEmailValidation = lazyImport(
  "@/pages/Email/EmailValidation",
  "EmailValidation",
);
