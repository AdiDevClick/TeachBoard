import { SidebarDataContext } from "@/api/contexts/SidebarDataContext.ts";
import {
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar.tsx";
import { use } from "react";
import { Link } from "react-router-dom";

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
            <Link to={url}>
              {Icon && (
                <Icon className="p-1 bg-muted-foreground/20 rounded-lg w-8! h-10!" />
              )}
              <p className="text-base font-semibold">{title}</p>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarHeader>
  );
}
