import type { ListMapperPartialChildrenObject } from "@/components/Lists/types/ListsTypes.ts";
import type { SafeListMapperProp } from "@/utils/types/types.utils.ts";
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
export type AppBreadCrumbListProps = {
  children: ListMapperPartialChildrenObject<BreadcrumbItem>;
  items: BreadcrumbItem[];
} & ComponentProps<"ol">;

/**
 * SECTION AppBreadcrumb types
 */

/** Standalone props */
type ListMapperProvidedProps = {
  name: string;
  url: string;
  index: number;
};

/** Base props common to both usage modes */
type AppBreadcrumbBaseProps = { segmentsLength: number };

/** Props that are needed for the breadcrumb segments when used standalone */
type AppBreadcrumbStandaloneProps = AppBreadcrumbBaseProps &
  ListMapperProvidedProps;

/** Props when used within ListMapper - all segment props become optional */
type AppBreadcrumbMappedProps = AppBreadcrumbBaseProps &
  SafeListMapperProp<ListMapperProvidedProps>;

/**
 * Smart type that requires all segment props in standalone usage
 * but makes them optional when used with ListMapper
 */
export type AppBreadcrumbProps =
  | ComponentProps<"li"> &
      (AppBreadcrumbMappedProps | AppBreadcrumbStandaloneProps);
