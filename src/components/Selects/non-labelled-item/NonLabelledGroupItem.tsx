import { SelectItem } from "@/components/ui/select.tsx";

/**
 * Select item component.
 *
 * @description Renders a select item with a label based on the provided item props.
 *
 * @param item - The item object containing entityTypeName, id, and name.
 */
export function NonLabelledGroupItem({ ...item }) {
  if (!item) {
    return <div>Loading...</div>;
  }
  const { id, name } = item;

  if (!id || !name) {
    return <div>Loading...</div>;
  }

  return <SelectItem value={id}>{name}</SelectItem>;
}
