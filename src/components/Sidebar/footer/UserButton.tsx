import { useAppStore } from "@/api/store/AppStore";
import { AvatarDisplay } from "@/components/Avatar/AvatarDisplay";
import type { DropDownItemClickDetails } from "@/components/Dropdowns/types/dropdowns.types";
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
import { IconDotsVertical } from "@tabler/icons-react";
import { useState } from "react";

/**
 * User navigation component for Sidebar
 *
 * @description Displays the user info and actions in sidebar
 */
export function UserButton({ onClick }: UserButtonProps) {
  const { name, email, avatar, settings } = useSidebarDataContext().user;
  const [open, setOpen] = useState(false);

  const isLoggedIn = useAppStore((state) => state.isLoggedIn);
  const user = useAppStore((state) => state.user);

  const avatarDisplay = {
    name: user?.name ?? name,
    email: user?.email ?? email,
    avatar: user?.avatar ?? avatar,
  };

  /**
   * Handles click on dropdown items in the user menu
   *
   * @param details - Details of the clicked item
   */
  const onClickHandler = (details: DropDownItemClickDetails) => {
    onClick?.(details);
    setOpen(false);
  };

  // Will be spread inside DropdownList to be used in onClick of each item
  const userData = { settings, isLoggedIn, onClick: onClickHandler };

  return (
    <SidebarMenu>
      <SidebarMenuItem className="sidebarButton--effect">
        <DropdownMenu open={open} onOpenChange={setOpen}>
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
          />
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
