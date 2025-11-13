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
} from "@/components/ui/sidebar";
import { useSidebarDataContext } from "@/hooks/contexts/useSidebarDataContext.ts";
import { IconDotsVertical } from "@tabler/icons-react";

/**
 * User navigation component for Sidebar
 *
 * @description Displays the user info and actions in sidebar
 */
export function UserButton() {
  const { name, email, avatar, ...rest } = useSidebarDataContext().user;

  const userDisplay = {
    name: name,
    email: email,
    avatar: avatar,
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <UserDisplay props={userDisplay} />
              <IconDotsVertical className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <TriggeredSettingsPopup userData={rest} userDisplay={userDisplay} />
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
