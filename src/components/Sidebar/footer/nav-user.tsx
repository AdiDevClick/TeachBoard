import { IconDotsVertical } from "@tabler/icons-react";

import { SidebarDataContext } from "@/api/contexts/SidebarDataContext.ts";
import { TriggeredSettingsPopup } from "@/components/Sidebar/footer/settings_popup/TriggeredSettingsPopup.tsx";
import { UserDisplay } from "@/components/Sidebar/footer/UserDisplay.tsx";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { use } from "react";

/**
 * User navigation component for Sidebar
 *
 * @description Displays the user info and actions in the sidebar
 */
export function NavUser() {
  const { isMobile } = useSidebar();
  const sidebar = use(SidebarDataContext);

  if (!sidebar) return null;

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <UserDisplay props={sidebar.user} />
              <IconDotsVertical className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <TriggeredSettingsPopup isMobile={isMobile} sidebar={sidebar} />
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
