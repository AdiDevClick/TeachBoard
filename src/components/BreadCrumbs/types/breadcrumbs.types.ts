import type { ComponentProps } from "react";
/**
 * Types for breadcrumb components
 */

/**
 * SECTION AppBreadcrumbAutoList types
 */
export type BreadcrumbItem = {
  name: string;
  url: string;
};

/** Props for AppBreadCrumbList component */
export type AppBreadCrumbListProps = Readonly<
  {
    items: BreadcrumbItem[];
  } & ComponentProps<"ol">
>;

/**
 * SECTION AppBreadcrumb types
 */

/**
 * Props for AppBreadCrumb component
 *
 * @description When used with ListMapper: only provide segmentsLength (and optional li props)
 */
export type AppBreadcrumbProps = ComponentProps<"li"> & {
  segmentsLength: number;
  name: string;
  url: string;
  index: number;
};
