import type { PageTitleProps } from "@/components/Header/types/header.types";
import { usePageTitle } from "@/hooks/usePageTitle";
import { cn } from "@/utils/utils";
import { CheckIcon, Pencil } from "lucide-react";
import { Activity, useRef, type MouseEvent } from "react";

/**
 * PageTitle component
 *
 * @description Displays a page title with an icon for editing the title.
 *
 * @param props - forwarded to the root container (accepts `data-page-title`)
 */
export function PageTitle(props: PageTitleProps) {
  const { setIsEditing, isEditing, setTitle, title, isTitleHidden } =
    usePageTitle();
  const ref = useRef<HTMLHeadingElement>(null);
  const { className, ...restProps } = props;

  /**
   * Handle click on the pencil icon to toggle editing mode
   *
   * @param event - Mouse event from the click
   */
  const handlePencilClick = (event: MouseEvent<SVGSVGElement>) => {
    event.stopPropagation();
    setIsEditing();
  };

  const handleBlur = () => {
    saveTitle();
  };

  const saveTitle = () => {
    if (isEditing && ref.current?.textContent) {
      setIsEditing(false);
      setTitle(ref.current.textContent);
    }
  };

  return (
    <div
      data-page-title={!isTitleHidden}
      className={cn("page__title-container", className)}
      {...restProps}
    >
      <h1
        ref={ref}
        contentEditable={isEditing}
        suppressContentEditableWarning
        onBlur={handleBlur}
      >
        {props.children ?? title}
      </h1>
      <Activity mode={isEditing ? "hidden" : "visible"}>
        <Pencil className="title__icon w-3" onClick={handlePencilClick} />
      </Activity>
      <Activity mode={isEditing ? "visible" : "hidden"}>
        <CheckIcon className="title__icon w-3" onClick={saveTitle} />
      </Activity>
    </div>
  );
}
