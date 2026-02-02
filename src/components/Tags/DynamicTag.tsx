import withController from "@/components/HOCs/withController.tsx";
import withListMapper from "@/components/HOCs/withListMapper";
import { withPopoverCRUD } from "@/components/Popovers/PopoverCRUD.tsx";
import type {
  DynamicTagProps,
  DynamicTagsProps,
  DynamicTagsState,
} from "@/components/Tags/types/tags.types";
import { Button } from "@/components/ui/button.tsx";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemGroup,
  ItemTitle,
} from "@/components/ui/item.tsx";
import { UniqueSet } from "@/utils/UniqueSet.ts";
import { useEffect, useState } from "react";

/**
 * DynamicTags Component
 *
 * @description Renders a list of dynamic tags with support for adding and removing tags.
 *
 * @param title - The title of the tag group
 * @param pageId - The unique identifier for the page or component instance
 * @param itemList - The list of tag items to render
 * @returns
 */
export function DynamicTags(props: DynamicTagsProps) {
  const { pageId, itemList, title, ...rest } = props;
  const scopedPageId = pageId ?? "dynamic-tag";
  const [renderItems, setRenderItems] = useState<
    UniqueSet<string, DynamicTagsState>
  >(new UniqueSet());

  /**
   * Synchronize renderItems with itemList prop
   *
   * @description This effect updates the renderItems state whenever the itemList prop changes.
   * It ensures that new items are added, and items that are no longer present are marked for exit animation.
   */
  useEffect(() => {
    setRenderItems((prev) => {
      const next = new UniqueSet<string, DynamicTagsState>();
      const seen = new Set<string>();

      const incomingEntries = Array.isArray(itemList)
        ? itemList
        : Object.entries(itemList ?? {});

      for (const [key] of incomingEntries) {
        seen.add(key);
        const existing = next.get(key);

        if (next.has(key) && !existing?.isExiting) {
          continue;
        }

        const nextEntry = {
          ...existing,
          isExiting: false,
        } as DynamicTagsState;

        next.set(key, nextEntry);
      }

      for (const [key, existing] of prev.entries()) {
        if (!seen.has(key) && !existing?.isExiting) {
          next.set(key, {
            ...existing,
            isExiting: true,
          });
        }
      }

      return next;
    });
  }, [itemList]);

  /**
   * Handle exit complete for a tag
   *
   * @description When a tag's exit animation is complete, remove it from the renderItems set and wait for React to re-render
   *
   * @param value - The value of the tag that has completed its exit animation
   */
  const handleExitComplete = (value: string) => {
    setRenderItems((prev) => {
      if (!prev.has(value)) return prev;
      const next = prev.clone();
      next.delete(value);
      return next;
    });
  };

  return (
    <ItemGroup id={`${scopedPageId}-roles`} className="grid gap-2">
      <ItemTitle>{title}</ItemTitle>
      <Item variant={"default"} className="p-0">
        <ItemContent className="flex-row flex-wrap gap-2">
          <DynamicTagList
            items={Array.from(renderItems.entries())}
            optional={([value, itemDetails]) => {
              return {
                value,
                itemDetails,
              };
            }}
            onExitComplete={handleExitComplete}
            {...rest}
          />
        </ItemContent>
      </Item>
    </ItemGroup>
  );
}

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
function DynamicTag(props: DynamicTagProps) {
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
        <Button size="sm" variant="outline">
          {valueStr}
        </Button>
      )}
    </ItemActions>
  );
}
const DynamicTagList = withListMapper(DynamicTag);
const ButtonWithPopoverCRUD = withPopoverCRUD(Button);

export const ControlledDynamicTagList = withController(DynamicTags);
