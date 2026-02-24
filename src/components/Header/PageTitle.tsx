import type { PageTitleProps } from "@/components/Header/types/header.types";
import { cn } from "@/utils/utils";
import { Pencil } from "lucide-react";

/**
 * PageTitle component
 *
 * @description Component to display a page title with an icon
 *
 * @param props - forwarded to the root container (accepts `data-page-title`)
 */
export function PageTitle(props: PageTitleProps) {
  const { className, ...restProps } = props;
  return (
    <div className={cn("page__title-container", className)} {...restProps}>
      <h1>{props.children}</h1>
      <Pencil className="title__icon w-3" />
    </div>
  );
}
