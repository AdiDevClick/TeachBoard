/**
 * @fileoverview Exports for Signup components
 */

import { lazyImport } from "@/utils/utils";

/**
 * Lazy-loaded version of Signup component for code-splitting and performance optimization
 */
export const LazySignup = lazyImport("@/pages/Signup/Signup", "Signup");
