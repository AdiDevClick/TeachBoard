import type { PageTitleProps } from "@/components/Header/types/header.types";
import { Pencil } from "lucide-react";

/**
 * PageTitle component
 *
 * @description Component to display a page title with an icon
 *
 * @param props - forwarded to the root container (accepts `data-page-title`)
 */
export function PageTitle(props: PageTitleProps) {
  return (
    <div className={"page__title-container"} {...props}>
      <h1>{props.children}</h1>
      <Pencil className="title__icon w-3" />
    </div>
  );
}
