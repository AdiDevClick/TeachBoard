import withListMapper from "@/components/HOCs/withListMapper";
import { DynamicTag } from "@/components/Tags/DynamicTag";
import { updateAnimationStack } from "@/components/Tags/functions/dynamic-tags-functions";
import type {
  DynamicTagItemDetails,
  DynamicTagsProps,
  DynamicTagsState,
} from "@/components/Tags/types/tags.types";
import {
  Item,
  ItemContent,
  ItemGroup,
  ItemTitle,
} from "@/components/ui/item.tsx";
import { UniqueSet } from "@/utils/UniqueSet.ts";
import { createComponentName } from "@/utils/utils";
import { useEffect, useEffectEvent, useState } from "react";

/**
 * DynamicTags Component
 *
 * @description Renders a list of dynamic tags with support for adding and removing tags.
 *
 * @param title - The title of the tag group
 * @param pageId - The unique identifier for the page or component instance
 * @param itemList - The list of tag items to render
 */
export function DynamicTags(props: DynamicTagsProps) {
  const [renderItems, setRenderItems] = useState<DynamicTagsState>(
    new UniqueSet(),
  );

  const {
    pageId = "dynamic-tag",
    itemList,
    title,
    disableAnimation = false,
    ...rest
  } = props;

  const entries = Array.isArray(itemList)
    ? itemList
    : Object.entries(itemList ?? {});

  const triggerUpdate = useEffectEvent(() => {
    if (disableAnimation) {
      const next = new UniqueSet<string, DynamicTagItemDetails>();

      for (const [value, itemDetails] of entries) {
        next.set(value, itemDetails);
      }

      setRenderItems(() => next);
    } else {
      updateAnimationStack(setRenderItems, entries, renderItems);
    }
  });

  /**
   * Synchronize renderItems with itemList prop
   *
   * @description For animated mode, update through animation stack. For disabled animation, keep sync directly.
   */
  useEffect(() => {
    triggerUpdate();
  }, [itemList, disableAnimation]);

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
    <ItemGroup id={`${pageId}-roles`} className="grid gap-2">
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
const DynamicTagList = withListMapper(DynamicTag);
createComponentName("withListMapper", "DynamicTagList", DynamicTagList);
