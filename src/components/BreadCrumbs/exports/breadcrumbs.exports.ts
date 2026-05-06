import { AppBreadCrumb } from "@/components/BreadCrumbs/AppBreadCrumb";
import withListMapper from "@/components/HOCs/withListMapper";
import { createComponentName, lazyImport } from "@/utils/utils";

/**
 * @fileoverview Exports for breadcrumb components
 * @description This file exports the breadcrumb components, applying necessary HOCs for enhanced functionality.
 */

/**
 * Exports for breadcrumb components
 */
export const BreadCrumbsList = withListMapper(AppBreadCrumb);
createComponentName("withListMapper", "BreadCrumbsList", BreadCrumbsList);

/**
 * LAZY-LOADED COMPONENTS
 */

/**
 * Lazy-loaded version of BreadCrumbsList for code-splitting and performance optimization
 */
export const LazyBreadCrumbsList = lazyImport(
  "@/components/BreadCrumbs/exports/breadcrumbs.exports",
  "BreadCrumbsList",
);
