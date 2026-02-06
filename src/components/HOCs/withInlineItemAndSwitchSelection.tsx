import {
  centralSwitch,
  content,
  label,
  labelledSwitchWithSelection,
} from "@/assets/css/LabelledSwitchWithSelection.module.scss";
import type {
  InlineItemAndSwitchSelectionPayload,
  InlineItemAndSwitchSelectionProps,
} from "@/components/HOCs/types/with-inline-item-and-switch.types.ts";
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
import { preventDefaultAndStopPropagation } from "@/utils/utils.ts";
import { useState, type ComponentType, type MouseEvent } from "react";

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
  Wrapped: ComponentType<T>,
) {
  return function Component(props: T & InlineItemAndSwitchSelectionProps) {
    const [isSelected, setIsSelected] = useState(props.isSelected ?? false);
    if (inlineItemAndSwitchSelectionPropsInvalid(props)) {
      debugLogs("withInlineItemAndSwitchSelection");
      return null;
    }

    const { onSwitchClick } = props;

    /**
     * Handle the switch click event.
     *
     * @remarks The event is prevented from propagating by default.
     *
     * @description If you pass an onSwitchClick prop, the internal state will already be changed before this handler is called.
     * The click is enriched with a payload containing the current local setter and item details.
     *
     * @param e - The mouse event triggered by clicking the switch.
     *
     * @example
     * ```tsx
     * const handleSwitchClick = (e, payload) => {
     *   console.log("Switch clicked for item:", payload.title, "New state:", payload.isSelected);
     *   // You can also use payload.setIsSelected to change the state from here if needed
     *  payload.setIsSelected(!payload.isSelected); // Force the reverse of the current state
     * }
     * ```
     */
    const handleSwitchClick = (e: MouseEvent<HTMLButtonElement>) => {
      preventDefaultAndStopPropagation(e);
      setIsSelected(!isSelected);

      const payload: InlineItemAndSwitchSelectionPayload = {
        id: props.id ?? "unknown-id",
        title: props.title,
        isSelected: !isSelected,
        index: props.index ?? "unknown-index",
        setIsSelected,
      };

      onSwitchClick?.(e, payload);
    };

    return (
      <Item className={labelledSwitchWithSelection}>
        <ItemContent className={label}>
          <ItemTitle>{props.title}</ItemTitle>
        </ItemContent>
        <ItemActions className={centralSwitch}>
          <Switch onClick={handleSwitchClick} checked={isSelected} />
        </ItemActions>
        <Wrapped {...props} className={content} disabled={!isSelected} />
      </Item>
    );
  };
}
