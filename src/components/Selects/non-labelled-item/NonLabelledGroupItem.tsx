import type { NonLabelledGroupItemProps } from "@/components/Selects/types/select.types.ts";
import { SelectItem } from "@/components/ui/select.tsx";
import {
  debugLogs,
  nonLabelledGroupItemPropsInvalid,
} from "@/configs/app-components.config";

/**
 * Select item component.
 *
 * @description If the item, id, or name is missing, it renders a loading state.
 *
 * @param item - The item object containing entityTypeName, id, and name.
 */
export function NonLabelledGroupItem(props: NonLabelledGroupItemProps) {
  if (nonLabelledGroupItemPropsInvalid(props)) {
    debugLogs("NonLabelledGroupItem", props);

    return <div>Loading item...</div>;
  }

  const { id, name } = props;

  return (
    <SelectItem
      className="[&>span:last-child]:block [&>span:last-child]:overflow-hidden [&>span:last-child]:text-ellipsis truncate"
      value={id}
    >
      {name}
    </SelectItem>
  );
}
