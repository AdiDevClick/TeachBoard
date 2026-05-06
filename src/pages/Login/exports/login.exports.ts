import { lazyImport } from "@/utils/utils";

/**
 * @fileoverview Exports for login components
 */

/**
 * Lazy-loaded version of Login component for code-splitting and performance optimization
 */
export const LazyLogin = lazyImport("@/pages/Login/Login", "Login");
