import type { NonLabelledGroupItemProps } from "@/components/Selects/types/select.types.ts";
import { SelectItem } from "@/components/ui/select.tsx";

/**
 * Select item component.
 *
 * @description If the item, id, or name is missing, it renders a loading state.
 *
 * @param item - The item object containing entityTypeName, id, and name.
 */
export function NonLabelledGroupItem(
  item: Readonly<NonLabelledGroupItemProps>,
) {
  const { id, name } = item;

  if (!item || !id || !name) {
    return <div>Loading item...</div>;
  }

  return (
    <SelectItem
      className="[&>span:last-child]:block [&>span:last-child]:overflow-hidden [&>span:last-child]:text-ellipsis truncate"
      value={id}
    >
      {name}
    </SelectItem>
  );
}
