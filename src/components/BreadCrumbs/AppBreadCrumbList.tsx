import type { AppBreadCrumbListProps } from "@/components/BreadCrumbs/types/breadcrumbs.types.ts";
import { ListMapper } from "@/components/Lists/ListMapper.tsx";
import { BreadcrumbList } from "@/components/ui/breadcrumb.tsx";

/**
 * Application breadcrumb list component
 *
 * @description Renders a list of breadcrumb items using ListMapper.
 *
 * @param children - Child components to render for each breadcrumb item
 * @param items - Array of breadcrumb items
 * @param ulProps - Additional props for the BreadcrumbList component
 */
export function AppBreadCrumbList({
  children,
  items,
  ...ulProps
}: Readonly<AppBreadCrumbListProps>) {
  return (
    <BreadcrumbList {...ulProps}>
      <ListMapper items={items}>{children}</ListMapper>
    </BreadcrumbList>
  );
}
