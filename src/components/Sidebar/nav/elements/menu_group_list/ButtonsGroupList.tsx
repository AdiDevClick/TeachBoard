import { ListMapper } from "@/components/Lists/ListMapper.tsx";
import type { ButtonsGroupListProps } from "@/components/Sidebar/nav/types/NavTypes.ts";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
} from "@/components/ui/sidebar.tsx";

/**
 * Buttons group list component
 *
 * @param items - Items to display in the group
 * @param label - Optional label for the group
 * @param children - Child components to render for each item
 * @param props - Additional props for the SidebarGroup
 */
export function ButtonsGroupList<T>({
  items,
  label,
  children,
  ...props
}: ButtonsGroupListProps<T>) {
  return (
    <SidebarGroup {...props}>
      {label && <SidebarGroupLabel>{label}</SidebarGroupLabel>}
      <SidebarGroupContent>
        <SidebarMenu>
          <ListMapper items={items}>{children}</ListMapper>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
