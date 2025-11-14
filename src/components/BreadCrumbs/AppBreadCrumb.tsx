import type { AppBreadcrumbProps } from "@/components/BreadCrumbs/types/breadcrumbs.types.ts";
import {
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb.tsx";

/**
 * Application breadcrumb item component
 *
 * @description Can be used with ListMapper which will automatically provide name, url, and index.
 * When used with ListMapper: only provide segmentsLength (and optional li props)
 * When used standalone: provide all props (name, url, index, segmentsLength)
 *
 * @param segmentsLength - Total number of segments in the breadcrumb
 * @param name - Name of the breadcrumb segment
 * @param url - URL of the breadcrumb segment
 * @param index - Index of the current segment
 */
export function AppBreadCrumb({ ...segment }: Readonly<AppBreadcrumbProps>) {
  const { name, url, index, segmentsLength, ...rest } = segment;

  if (segmentsLength === null) {
    throw new Error(
      "AppBreadCrumb: segmentsLength prop is required in all usages."
    );
  }

  const useSeparator = index !== undefined && index < segmentsLength - 1;

  return (
    <>
      <BreadcrumbItem className="header__breadcrumb-item" {...rest}>
        <BreadcrumbLink href={url ?? "#"}>{name ?? "Unnamed"}</BreadcrumbLink>
      </BreadcrumbItem>
      {useSeparator && (
        <BreadcrumbSeparator className="header__breadcrumb-separator" />
      )}
    </>
  );
}
