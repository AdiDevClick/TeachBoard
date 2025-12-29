import { preventButtonToBeSelected } from "@/components/Selects/functions/select.functions.ts";
import type { InertSelectItemProps } from "@/components/Selects/types/select.types.ts";
import { SelectItem } from "@/components/ui/select.tsx";
import { useState } from "react";

/***
 * Select item component that becomes inert on click to prevent selection when an inner button is clicked.
 *
 * @param props - Props for Select Items
 */
export function InertSelectItem(props: Readonly<InertSelectItemProps>) {
  const { value, ...rest } = props;
  const [selected, setSelected] = useState(false);
  return (
    <SelectItem
      inert={selected}
      value={value}
      onPointerUp={(e) => {
        preventButtonToBeSelected({
          e,
          setSelected,
        });
        setSelected(false);
      }}
      {...rest}
    >
      {props.children}
    </SelectItem>
  );
}
