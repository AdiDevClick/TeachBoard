import type { SubMenuButtonProps } from "@/components/Sidebar/nav/types/NavTypes.ts";
import {
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar.tsx";
import { Link } from "react-router";

/**
 * Submenu button component
 *
 * @param item - Submenu item to display
 */
export function SubMenuButton({ ...item }: SubMenuButtonProps) {
  return (
    <SidebarMenuSubItem>
      <SidebarMenuSubButton asChild>
        <Link to={item.url ?? "#"}>
          <span>{item.title}</span>
        </Link>
      </SidebarMenuSubButton>
    </SidebarMenuSubItem>
  );
}
