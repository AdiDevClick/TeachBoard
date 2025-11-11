import { ListMapper } from "@/components/Lists/ListMapper.tsx";
import type { LabelledGroupProps } from "@/components/Selects/types/select.types.ts";
import { SelectGroup, SelectLabel } from "@/components/ui/select.tsx";

/**
 * Labelled group component.
 *
 * @param groups - The group object containing an array [name, items].
 * @param children - The child components to render within the group.
 */
export function LabelledGroup({
  children,
  ...items
}: Readonly<LabelledGroupProps>) {
  const { [0]: name, [1]: groupItems } = items;

  if (!items || !name || !groupItems) {
    return <div>Loading...</div>;
  }

  return (
    <SelectGroup>
      <SelectLabel>{name}</SelectLabel>
      {children && <ListMapper items={groupItems}>{children}</ListMapper>}
    </SelectGroup>
  );
}
