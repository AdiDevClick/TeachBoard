import type { MenuContentProps } from "@/components/Sidebar/nav/types/NavTypes.ts";
import { SidebarMenuButton } from "@/components/ui/sidebar.tsx";
import "@css/SidebarButtons.scss";
import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

/**
 * Menu button component for sidebar menu items.
 * Passing a submenu will display a chevron icon.
 *
 * @description This can be used as the trigger for collapsible menu items in the sidebar.
 *
 * @param item Menu item to display
 * @param setStyle Function to set style&
 */
export default function PrimaryMenuButton({
  item,
  setStyle = () => "",
  ...props
}: MenuContentProps) {
  if (!item) return null;
  const isQuickButtonEnabled = item.quickButton?.enabled;

  return (
    <Link to={item.url ?? "#"} className="w-full">
      <SidebarMenuButton
        {...props}
        className={`sidebarButton--menu ${setStyle({
          isQuickButtonEnabled,
          isMenu: false,
        })} ${props.className ?? ""}`}
        title={item.tooltip}
      >
        {item.icon && <item.icon className="sidebarButton--menu-icon" />}
        <p>{item.title}</p>
        {item.subMenus && <ChevronRight className="sidebarButton--submenu" />}
      </SidebarMenuButton>
    </Link>
  );
}
