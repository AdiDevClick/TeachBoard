import {
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar.tsx";
import { useSidebarDataContext } from "@/hooks/contexts/useSidebarDataContext.ts";
import "@css/SidebarHeader.scss";
import { Link } from "react-router-dom";

/**
 * Team header component for the sidebar.
 *
 * @description Hardcoded for now, to be replaced with dynamic data later.
 */
export default function Header() {
  const { state } = useSidebar();
  const sidebar = useSidebarDataContext();

  const { url, tooltip, title, icon: Icon } = sidebar.sidebarHeader || {};

  return (
    <SidebarHeader>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton
            asChild
            size={state === "collapsed" ? "lg" : "default"}
            className="data-[slot=sidebar-menu-button]:p-0.5"
            title={tooltip}
          >
            <Link to={url} className="sidebar-header__link">
              {Icon && <Icon className="link__icon" />}
              <p>{title}</p>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarHeader>
  );
}
