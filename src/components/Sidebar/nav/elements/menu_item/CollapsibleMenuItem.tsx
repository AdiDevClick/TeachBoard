import CollapsibleMenu from "@/components/Sidebar/nav/collapsible/collapsible_menu/CollapsibleMenu";
import QuickButton from "@/components/Sidebar/nav/elements/quick_button/QuickButton";
import type {
  CollapsibleMenuItemProps,
  NavMainMenuItem,
} from "@/components/Sidebar/nav/types/NavTypes.ts";
import {
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar.tsx";
import "@css/Collapsible.scss";
import { Collapsible, CollapsibleContent } from "@radix-ui/react-collapsible";

/**
 * Menu Item component for Sidebar navigation
 *
 * @param item Menu item to display
 * @param setStyle Function to set style
 * @returns
 */
export default function CollapsibleMenuItem({
  setStyle,
  ...item
}: CollapsibleMenuItemProps) {
  const { quickButton, isActive, subMenus } = item;
  const isQuickButtonEnabled = quickButton?.enabled;

  return (
    <Collapsible
      asChild
      defaultOpen={isActive}
      className="group/collapsible collapsible"
    >
      <SidebarMenuItem
        className={setStyle({ isQuickButtonEnabled, isMenu: true })}
      >
        <CollapsibleMenu item={item as NavMainMenuItem} setStyle={setStyle} />

        {isQuickButtonEnabled && <QuickButton item={quickButton} />}

        {subMenus && (
          <CollapsibleContent className="collapsible__content">
            <SidebarMenuSub>
              {subMenus.map((subMenu) => (
                <SidebarMenuSubItem key={subMenu.title}>
                  <SidebarMenuSubButton asChild>
                    <a href={subMenu.url}>
                      <span>{subMenu.title}</span>
                    </a>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              ))}
            </SidebarMenuSub>
          </CollapsibleContent>
        )}
      </SidebarMenuItem>
    </Collapsible>
  );
}
