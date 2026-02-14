import { AppBreadCrumb } from "@/components/BreadCrumbs/AppBreadCrumb";
import withListMapper from "@/components/HOCs/withListMapper";
import { lazy } from "react";

/**
 * @fileoverview Exports for breadcrumb components
 * @description This file exports the breadcrumb components, applying necessary HOCs for enhanced functionality.
 */

/**
 * Exports for breadcrumb components
 */
export const BreadCrumbsList = withListMapper(AppBreadCrumb);

/**
 * LAZY-LOADED COMPONENTS
 */

/**
 * Lazy-loaded version of BreadCrumbsList for code-splitting and performance optimization
 */
export const LazyBreadCrumbsList = lazy(async () => {
  const Component = await import("./breadcrumbs.exports.ts");
  return { default: Component.BreadCrumbsList };
});
