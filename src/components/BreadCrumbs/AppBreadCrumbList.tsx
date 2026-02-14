import { BreadCrumbsList } from "@/components/BreadCrumbs/exports/breadcrumbs.exports";
import type { AppBreadCrumbListProps } from "@/components/BreadCrumbs/types/breadcrumbs.types.ts";
import { BreadcrumbList } from "@/components/ui/breadcrumb.tsx";
import {
  appBreadCrumbListPropsInvalid,
  debugLogs,
} from "@/configs/app-components.config";

/**
 * Application breadcrumb list component
 *
 * @description Renders a list of breadcrumb items using ListMapper.
 *
 * @param items - Array of breadcrumb items
 * @param ulProps - Additional props for the BreadcrumbList component
 */
export function AppBreadCrumbList(props: AppBreadCrumbListProps) {
  if (appBreadCrumbListPropsInvalid(props)) {
    debugLogs("AppBreadCrumbList", props);
    return null;
  }

  const { items, ...ulProps } = props;

  return (
    <BreadcrumbList {...ulProps}>
      <BreadCrumbsList
        items={items}
        optional={{ segmentsLength: items.length }}
      />
    </BreadcrumbList>
  );
}
