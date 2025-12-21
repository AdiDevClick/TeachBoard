import { AvatarDisplay } from "@/components/Sidebar/footer/AvatarDisplay.tsx";
import { TriggeredSettingsPopup } from "@/components/Sidebar/footer/settings_popup/TriggeredSettingsPopup.tsx";
import type { UserButtonProps } from "@/components/Sidebar/footer/types/footer.types";
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
import { useAppStore } from "@/hooks/store/AppStore.ts";
import { IconDotsVertical } from "@tabler/icons-react";

/**
 * User navigation component for Sidebar
 *
 * @description Displays the user info and actions in sidebar
 */
export function UserButton({
  handleOnFooterButtonsClick,
}: Readonly<UserButtonProps>) {
  const { name, email, avatar, settings } = useSidebarDataContext().user;

  const isLoggedIn = useAppStore((state) => state.isLoggedIn);
  const user = useAppStore((state) => state.user);

  const avatarDisplay = {
    name: user?.name ?? name,
    email: user?.email ?? email,
    avatar: user?.avatar ?? avatar,
  };

  const userData = { settings, isLoggedIn };

  return (
    <SidebarMenu>
      <SidebarMenuItem className="sidebarButton--effect">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton size="lg" className="sidebarButton--menu">
              <AvatarDisplay props={avatarDisplay}>
                <IconDotsVertical className="sidebarButton--menu-dots" />
              </AvatarDisplay>
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <TriggeredSettingsPopup
            userData={userData}
            avatarDisplay={avatarDisplay}
            handleOnFooterButtonsClick={handleOnFooterButtonsClick}
          />
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
