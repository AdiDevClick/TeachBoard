import { ButtonsGroupList } from "@/components/Sidebar/nav/elements/menu_group_list/ButtonsGroupList";
import CollapsibleMenuItem from "@/components/Sidebar/nav/elements/menu_item/CollapsibleMenuItem";
import type { SetStyleMenuProps } from "@/components/Sidebar/nav/types/NavTypes";
import { useSidebarDataContext } from "@/hooks/contexts/useSidebarDataContext.ts";

/**
 * Main Navigation component for Sidebar
 *
 * @description Displays the main navigation menus in the sidebar
 * @param items - Navigation items
 * @returns
 */
export function MainNavigation() {
  const sidebar = useSidebarDataContext();

  const { groupLabel, menus: navItems } = sidebar.navMain;

  return (
    <ButtonsGroupList items={navItems} label={groupLabel}>
      <CollapsibleMenuItem setStyle={setStyle} />
    </ButtonsGroupList>
  );
}

/**
 * Set style for menu item or button
 *
 * @param item Item to display
 * @param isMenu Indicates if the style is for menu or button
 * @returns
 */
function setStyle({ isQuickButtonEnabled, isMenu }: SetStyleMenuProps): string {
  if (!isQuickButtonEnabled) return "";

  if (isMenu) {
    return "sidebarButton--menu";
  }

  return "sidebarButton";
}
