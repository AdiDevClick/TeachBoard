import { CollapsibleContents } from "@/components/Sidebar/nav/collapsible/collapsible_contents/CollapsibleContents.tsx";
import CollapsibleMenu from "@/components/Sidebar/nav/collapsible/collapsible_menu/CollapsibleMenu";
import QuickButton from "@/components/Sidebar/nav/elements/quick_button/QuickButton";
import type {
  CollapsibleMenuItemProps,
  NavMainMenuItem,
} from "@/components/Sidebar/nav/types/NavTypes.ts";
import { SidebarMenuItem, useSidebar } from "@/components/ui/sidebar.tsx";
import "@css/Collapsible.scss";
import { Collapsible } from "@radix-ui/react-collapsible";
import { useEffect, useEffectEvent, useState } from "react";

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
  const { open, setOpen: openSidebar } = useSidebar();
  const { quickButton, isActive, subMenus } = item;
  const [isCollapsibleOpened, setIsCollapsibleOpened] = useState(isActive);
  const isQuickButtonEnabled = quickButton?.enabled;

  /**
   * Reset collapsible
   */
  const resetCollapsible = useEffectEvent(() => {
    if (isCollapsibleOpened) {
      setIsCollapsibleOpened(false);
    }
  });

  /**
   * Reset collapsible
   *
   * @description When the sidebar is closed
   */
  useEffect(() => {
    if (!open) {
      resetCollapsible();
    }
  }, [open]);

  return (
    <Collapsible
      asChild
      open={open && isCollapsibleOpened}
      onOpenChange={(nextOpen) => {
        if (!open && nextOpen && subMenus && subMenus.length > 0) {
          openSidebar(true);
        }

        setIsCollapsibleOpened(nextOpen);
      }}
      className="group/collapsible collapsible"
    >
      <SidebarMenuItem
        className={setStyle({ isQuickButtonEnabled, isMenu: true })}
      >
        <CollapsibleMenu item={item as NavMainMenuItem} setStyle={setStyle} />
        <QuickButton enabled={isQuickButtonEnabled} item={quickButton} />
        <CollapsibleContents subMenus={subMenus ?? []} />
      </SidebarMenuItem>
    </Collapsible>
  );
}
