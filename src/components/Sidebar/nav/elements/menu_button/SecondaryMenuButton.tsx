import type { NavSecondaryProps } from "@/components/Sidebar/nav/types/NavTypes.ts";
import {
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar.tsx";
import { Switch } from "@/components/ui/switch.tsx";

/**
 * Secondary menu button component
 *
 * @description This button will be able to display
 * a switch icon if provided.
 *
 * @param item - item Props for the secondary menu button
 */
export function SecondaryMenuButton({ ...item }: NavSecondaryProps) {
  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild>
        <a href={item.url ?? "#"}>
          {item.icon && <item.icon />}
          <span className="flex-1 truncate">{item.title}</span>
          {item.switchIcon && <Switch />}
        </a>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}
