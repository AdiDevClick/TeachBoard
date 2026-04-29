import { lazyImport } from "@/utils/utils";

/**
 * @fileoverview Exports for about page components
 */

/**
 * Lazy-loaded version of About component for code-splitting and performance optimization
 */
export const LazyAbout = lazyImport("@/pages/About/About", "About");
