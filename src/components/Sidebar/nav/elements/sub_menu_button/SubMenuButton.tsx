import type { SubMenuButtonProps } from "@/components/Sidebar/nav/types/NavTypes.ts";
import {
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar.tsx";
import { Link } from "react-router";

/**
 * Sidebar Submenu button component
 *
 * @description Currently used in the CollapsibleContents component to render submenu items
 *
 * @param item - Submenu item to display
 */
export function SubMenuButton({ ...item }: SubMenuButtonProps) {
  const { title, url, icon } = item;

  return (
    <SidebarMenuSubItem>
      <SidebarMenuSubButton asChild>
        <Link to={url ?? "#"}>
          <span>{title ?? "untitled submenu"}</span>
        </Link>
      </SidebarMenuSubButton>
    </SidebarMenuSubItem>
  );
}
