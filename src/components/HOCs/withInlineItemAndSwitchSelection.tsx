import type { InlineItemAndSwitchSelectionProps } from "@/components/HOCs/types/with-inline-item-and-switch.types.ts";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemTitle,
} from "@/components/ui/item.tsx";
import { Switch } from "@/components/ui/switch.tsx";
import {
  debugLogs,
  inlineItemAndSwitchSelectionPropsInvalid,
} from "@/configs/app-components.config.ts";
import type { ComponentProps, ComponentType } from "react";

/**
 * Wrap a component to be displayed inline within an Item with a Switch.
 * @param Wrapped - The component to be wrapped.
 *
 * @example
 * ```tsx
 * const SelectWithInlineSwitch = withInlineItemAndSwitchSelection(Select);
 *  <SelectWithInlineSwitch
 *    title="Enable Selection"
 *    onSwitchClick={handleSwitchClick}
 *   {...otherSelectProps}
 * />
 * ```
 */
export function withInlineItemAndSwitchSelection<T extends object>(
  Wrapped: ComponentType<T>
) {
  return function Component(props: T & InlineItemAndSwitchSelectionProps) {
    if (inlineItemAndSwitchSelectionPropsInvalid(props)) {
      debugLogs("withInlineItemAndSwitchSelection");
      return null;
    }

    const { title, onSwitchClick, ...restProps } = props;

    return (
      <Item>
        <ItemContent>
          <ItemTitle>{title}</ItemTitle>
        </ItemContent>
        <ItemActions>
          <Switch onClick={onSwitchClick} />
        </ItemActions>
        <ItemContent>
          <Wrapped {...(restProps as T)} />
        </ItemContent>
      </Item>
    );
  };
}
