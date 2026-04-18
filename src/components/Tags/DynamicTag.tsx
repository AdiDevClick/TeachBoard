import { withPopoverCRUD } from "@/components/HOCs/withPopoverCRUD";
import type { DynamicTagProps } from "@/components/Tags/types/tags.types";
import { Button } from "@/components/ui/button";
import { ItemActions } from "@/components/ui/item";

/**
 * DynamicTag Component
 *
 * @description Renders a single dynamic tag with popover CRUD functionality.
 *
 * @param value - The value of the tag
 * @param itemDetails - Additional details for the tag
 * @param isExiting - Whether the tag is in the process of exiting
 * @param onExitComplete - Callback when exit animation is complete
 */
export function DynamicTag(props: DynamicTagProps) {
  const {
    onRemove,
    value = "Dynamic-Tag(untitled)",
    itemDetails,
    displayCRUD = true,
    onExitComplete,
    ...rest
  } = props;

  const id = itemDetails?.id;
  const isExiting = itemDetails?.isExiting ?? false;

  /**
   * Handle animation end to notify parent that exit animation is complete
   */
  const handleAnimationEnd = () => {
    if (isExiting) {
      onExitComplete?.(value);
    }
  };

  return (
    <ItemActions
      className={isExiting ? "closed" : "opened"}
      onAnimationEnd={handleAnimationEnd}
      id={id}
      data-role-id={value}
      ref={(el) => {
        rest.setRef?.(el, {
          type: "tag",
          name: id,
          id: id,
        });
      }}
    >
      {displayCRUD && (
        <ButtonWithPopoverCRUD
          id={value}
          size="sm"
          variant="outline"
          onRemove={onRemove}
          value={value}
          itemDetails={itemDetails}
        >
          {value}
        </ButtonWithPopoverCRUD>
      )}
      {!displayCRUD && (
        <Button type="button" size="sm" variant="outline">
          {value}
        </Button>
      )}
    </ItemActions>
  );
}

const ButtonWithPopoverCRUD = withPopoverCRUD(Button);
