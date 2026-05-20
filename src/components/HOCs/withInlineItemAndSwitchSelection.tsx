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
import { cn, preventDefaultAndStopPropagation } from "@/utils/utils.ts";
import {
  useEffect,
  useState,
  type ComponentType,
  type MouseEvent,
} from "react";

/**
 * Wrap a component to be displayed inline within an Item with a Switch.
 *
 * @param Wrapped - The component to wrap and display inline with the switch.
 *
 * @returns A new component that renders the Wrapped component inline with a switch to toggle its selection state.
 *
 * @description This HOC is designed for use in contexts like lists or tables where you want to have an inline item with a switch to toggle its selection, and the wrapped component will be disabled when not selected. The switch's state can be controlled both internally and externally (e.g., by a parent controller or an "All ON/OFF" action).
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
    const selectedFromProps = props.isSelected ?? props.value;
    const [isSelected, setIsSelected] = useState(selectedFromProps ?? false);

    /**
     * Handles the case where a selection change is triggered from outside the component (e.g., by the controller or by an All ON/OFF action).
     *
     * @description Keep the local selection in sync with controller-driven values.
     */
    useEffect(() => {
      if (selectedFromProps !== isSelected) {
        setIsSelected(selectedFromProps);
      }
    }, [selectedFromProps, isSelected]);

    if (inlineItemAndSwitchSelectionPropsInvalid(props)) {
      debugLogs("withInlineItemAndSwitchSelection");
      return null;
    }

    const { onSwitchClick } = props;

    /**
     * Toggle the local state, then forward the change to the controller and caller.
     *
     * @param e - The click event from the switch button.
     *
     * @remark The payload includes the new selection state and other relevant info for the parent component to handle the change (e.g., update the selection state for all items if "All ON/OFF" is triggered).
     */
    const handleSwitchClick = (e: MouseEvent<HTMLButtonElement>) => {
      preventDefaultAndStopPropagation(e);
      const nextIsSelected = !isSelected;

      const payload: InlineItemAndSwitchSelectionPayload = {
        id: props.id ?? "unknown-id",
        title: props.title,
        isSelected: nextIsSelected,
        index: props.index ?? "unknown-index",
        setIsSelected,
      };

      setIsSelected(nextIsSelected);
      props.onChange?.(nextIsSelected, payload);
      onSwitchClick?.(e, payload);
    };

    return (
      <Item className={cn(labelledSwitchWithSelection, props.className)}>
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
