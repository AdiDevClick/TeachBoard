import { SidebarDataContext } from "@/api/contexts/SidebarDataContext.ts";
import {
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar.tsx";
import { use } from "react";

/**
 * Team header component for the sidebar.
 *
 * @description Hardcoded for now, to be replaced with dynamic data later.
 */
export default function Header() {
  const sidebar = use(SidebarDataContext);
  if (!sidebar) return null;

  const { url, tooltip, title, icon: Icon } = sidebar.sidebarHeader || {};

  return (
    <SidebarHeader>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton
            asChild
            className="data-[slot=sidebar-menu-button]:p-1.5"
            title={tooltip}
          >
            <a href={url}>
              {Icon && <Icon className="size-5!" />}
              <span className="text-base font-semibold">{title}</span>
            </a>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarHeader>
  );
}
