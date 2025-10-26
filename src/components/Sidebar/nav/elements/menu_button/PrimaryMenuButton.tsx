import type { MenuContentProps } from "@/components/Sidebar/nav/types/NavTypes.ts";
import { SidebarMenuButton } from "@/components/ui/sidebar.tsx";
import { ChevronRight } from "lucide-react";

/**
 * Menu button component for sidebar menu items.
 * Passing a submenu will display a chevron icon.
 *
 * @description This can be used as the trigger for collapsible menu items in the sidebar.
 *
 * @param item Menu item to display
 * @param setStyle Function to set style
 */
export default function PrimaryMenuButton({
  item,
  setStyle = () => "",
  ...props
}: MenuContentProps) {
  const isQuickButtonEnabled = item.quickButton?.enabled;
  return (
    <SidebarMenuButton
      {...props}
      className={`${setStyle({ isQuickButtonEnabled, isMenu: false })} ${
        props.className ?? ""
      }`}
      // className={setStyle({ item, isMenu: false })}
      title={item.tooltip}
    >
      {/* <a href="#"> */}
      {item.icon && <item.icon />}
      <span>{item.title}</span>
      {/* </a> */}

      {item.subMenus && (
        <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
      )}
    </SidebarMenuButton>
  );
}
