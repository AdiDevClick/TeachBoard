import type { ListMapperPartialChildrenObject } from "@/components/Lists/types/ListsTypes.ts";
import type { ComponentProps } from "react";
/**
 * Types for breadcrumb components
 */

/**
 * SECTION AppBreadcrumbAutoList types
 */
type BreadcrumbItem = {
  name: string;
  url: string;
};

/** Props for AppBreadCrumbList component */
export type AppBreadCrumbListProps = {
  children: ListMapperPartialChildrenObject<BreadcrumbItem>;
  items: BreadcrumbItem[];
} & ComponentProps<"ol">;

/**
 * SECTION AppBreadcrumb types
 */
/** Base props that are always required */
type AppBreadcrumbBaseProps = {
  segmentsLength: number;
} & ComponentProps<"li">;

/** Props that are needed for the breadcrumb segments */
type AppBreadcrumbAutoProps = {
  name: string;
  url: string;
  index: number;
};

/**
 * Smart type that requires all auto props if at least one is provided
 * This ensures type safety: either provide none (ListMapper usage) or all (standalone usage)
 */
export type AppBreadcrumbProps = AppBreadcrumbBaseProps &
  (AppBreadcrumbAutoProps | { name?: never; url?: never; index?: never });
