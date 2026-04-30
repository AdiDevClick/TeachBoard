import SidebarCollapsibleTrigger from "@/components/Sidebar/nav/collapsible/trigger/CollapsibleTrigger";
import PrimaryMenuButton from "@/components/Sidebar/nav/elements/menu_button/PrimaryMenuButton";
import type { CollapsibleMenuProps } from "@/components/Sidebar/nav/types/NavTypes.ts";

/**
 * Menu button component for sidebar menu items.
 * Passing a submenu will display a chevron icon.
 *
 * @description This can be used as the trigger for collapsible menu items in the sidebar.
 *
 * @param item Menu item to display
 * @param setStyle Function to set style
 */
export default function CollapsibleMenu({
  item,
  setStyle,
}: Readonly<CollapsibleMenuProps>) {
  return (
    <SidebarCollapsibleTrigger>
      <PrimaryMenuButton item={item} setStyle={setStyle} />
    </SidebarCollapsibleTrigger>
  );
}
