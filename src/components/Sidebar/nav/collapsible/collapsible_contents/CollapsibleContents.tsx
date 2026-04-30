import withListMapper from "@/components/HOCs/withListMapper";
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
}: Readonly<CollapsibleContentsProps>) {
  if (!subMenus.length) {
    return null;
  }

  return (
    <CollapsibleContent className="collapsible__content">
      <SidebarMenuSub>
        <SubMenuList items={subMenus} />
      </SidebarMenuSub>
    </CollapsibleContent>
  );
}

const SubMenuList = withListMapper(SubMenuButton);
