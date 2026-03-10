import type { PageTitleProps } from "@/components/Header/types/header.types";
import { cn } from "@/utils/utils";
import { CheckIcon, Pencil } from "lucide-react";
import { Activity, useRef, useState, type MouseEvent } from "react";

/**
 * @todo: Intentionnaly left the contentEditable functionality commented out for now as it needs some adjustments to work properly.
 * Functionnality works but the state should be refined
 * Will be re-enabled once those issues are resolved.
 *
 * PageTitle component
 *
 * @description Component to display a page title with an icon
 *
 * @param props - forwarded to the root container (accepts `data-page-title`)
 */
export function PageTitle(props: PageTitleProps) {
  const [titleState, setTitleState] = useState({
    isEditing: false,
    title: props.children,
  });
  const ref = useRef<HTMLHeadingElement>(null);
  const { className, ...restProps } = props;

  /**
   * Handle click on the pencil icon to toggle editing mode
   *
   * @param event - Mouse event from the click
   */
  const handlePencilClick = (event: MouseEvent<SVGSVGElement>) => {
    event.stopPropagation();
    setTitleState((prev) => ({ ...prev, isEditing: !prev.isEditing }));

    if (!titleState.isEditing && ref.current?.textContent) {
      ref.current.onblur = () => {
        setTitleState((prev) => ({
          ...prev,
          title: ref.current?.textContent || prev.title,
          isEditing: false,
        }));
      };
    }
  };

  return (
    <div className={cn("page__title-container", className)} {...restProps}>
      <h1
        ref={ref}
        // contentEditable={titleState.isEditing}
        suppressContentEditableWarning
      >
        {props.children}
        {/* {titleState.title} */}
      </h1>
      <Activity mode={titleState.isEditing ? "hidden" : "visible"}>
        <Pencil className="title__icon w-3" onClick={handlePencilClick} />
      </Activity>
      <Activity mode={titleState.isEditing ? "visible" : "hidden"}>
        <CheckIcon className="title__icon w-3" onClick={handlePencilClick} />
      </Activity>
    </div>
  );
}
