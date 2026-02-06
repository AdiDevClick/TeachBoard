import { withPopoverCRUD } from "@/components/Popovers/PopoverCRUD";
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
    value,
    itemDetails,
    displayCRUD = true,
    onExitComplete,
    ...rest
  } = props;
  const valueStr = value ?? "Dynamic-Tag(untitled)";
  const itemId = itemDetails?.id;

  /**
   * Handle animation end to notify parent that exit animation is complete
   */
  const handleAnimationEnd = () => {
    if (itemDetails?.isExiting) {
      onExitComplete?.(valueStr);
    }
  };

  return (
    <ItemActions
      className={itemDetails?.isExiting ? "closed" : "opened"}
      onAnimationEnd={handleAnimationEnd}
      id={itemId}
      data-role-id={valueStr}
      ref={(el) => {
        rest.setRef?.(el, {
          type: "tag",
          name: itemId,
          id: itemId,
        });
      }}
    >
      {displayCRUD && (
        <ButtonWithPopoverCRUD
          id={valueStr}
          size="sm"
          variant="outline"
          onRemove={onRemove}
          value={valueStr}
          itemDetails={itemDetails}
        >
          {valueStr}
        </ButtonWithPopoverCRUD>
      )}
      {!displayCRUD && (
        <Button type="button" size="sm" variant="outline">
          {valueStr}
        </Button>
      )}
    </ItemActions>
  );
}

const ButtonWithPopoverCRUD = withPopoverCRUD(Button);
