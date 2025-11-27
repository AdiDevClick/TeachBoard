import { preventButtonToBeSelected } from "@/components/Selects/functions/select.functions.ts";
import type { SelectItemWithIconProps } from "@/components/Selects/types/select.types.ts";
import { Button } from "@/components/ui/button.tsx";
import { SelectItem } from "@/components/ui/select.tsx";
import { PlusIcon } from "lucide-react";
import { useState } from "react";

/**
 * Select item component with an icon button to trigger additional actions.
 *
 * @description The button will not trigger the select item selection but can be used to open modals or perform other actions. Simply use the onClick or onPointerDown props to handle the button action.
 *
 * !! IMPORTANT !! The onPointerUp event is used to manage the state.
 *
 * @param value - The value of the select item.
 * @param selectText - The text to display for the select item.
 * @param props - Additional props for the SelectItem component.
 */
export function SelectItemWithIcon({
  value,
  selectText,
  ...props
}: SelectItemWithIconProps) {
  const [selected, setSelected] = useState(false);

  return (
    <SelectItem
      inert={selected}
      onPointerUp={(e) =>
        preventButtonToBeSelected({
          e,
          setSelected,
        })
      }
      value={value}
      {...props}
    >
      {/* <SelectItemIndicator>...</SelectItemIndicator> */}
      {props.children}
      <span className="loneText">{selectText}</span>
      <Button variant="ghost" size="icon" className="rounded-full max-h-2">
        <PlusIcon />
      </Button>
    </SelectItem>
  );
}
