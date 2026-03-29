import type { GenericSelectItemProps } from "@/components/Selects/types/select.types";
import { SelectItem } from "@/components/ui/select";

/**
 * A simple & generic select item component that can be used in any select field, rendering the value as the content of the item.
 *
 * @param value - The value of the select item, which will also be displayed as the content of the item.
 * @param props - Additional props to be passed to the underlying SelectItem component.
 */
export function GenericSelectItem({ value, ...props }: GenericSelectItemProps) {
  return (
    <SelectItem value={value} {...props}>
      {value}
    </SelectItem>
  );
}
