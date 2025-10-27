import { ListMapper } from "@/components/Lists/ListMapper.tsx";
import { SubMenuButton } from "@/components/Sidebar/nav/elements/sub_menu_button/SubMenuButton.tsx";
import type { CollapsibleContentsProps } from "@/components/Sidebar/nav/types/NavTypes.ts";
import { SidebarMenuSub } from "@/components/ui/sidebar.tsx";
import { CollapsibleContent } from "@radix-ui/react-collapsible";

/**
 * Collapsible contents component
 *
 * @param subMenus - Submenu items to display
 */
export function CollapsibleContents({
  subMenus = [],
}: CollapsibleContentsProps) {
  return (
    <CollapsibleContent className="collapsible__content">
      <SidebarMenuSub>
        <ListMapper items={subMenus}>
          <SubMenuButton />
        </ListMapper>
      </SidebarMenuSub>
    </CollapsibleContent>
  );
}
