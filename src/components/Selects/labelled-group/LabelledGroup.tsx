import { ListMapper } from "@/components/Lists/ListMapper.tsx";
import type { LabelledGroupProps } from "@/components/Selects/types/select.types.ts";
import { SelectGroup, SelectLabel } from "@/components/ui/select.tsx";

/**
 * Labelled group component.
 *
 * @param groups - The group object containing an array [name, items].
 * @param children - The child components to render within the group.
 */
export function LabelledGroup<
  T extends Record<string, unknown> = Record<string, unknown>
>({ children, ...groups }: Readonly<LabelledGroupProps<T>>) {
  if (!groups) {
    return <div>Loading...</div>;
  }

  const { [0]: name, [1]: groupItems } = groups;

  return (
    <SelectGroup>
      <SelectLabel>{name}</SelectLabel>
      {children && <ListMapper items={groupItems}>{children}</ListMapper>}
    </SelectGroup>
  );
}
