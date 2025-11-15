import { TriggeredSettingsPopup } from "@/components/Sidebar/footer/settings_popup/TriggeredSettingsPopup.tsx";
import type { UserButtonProps } from "@/components/Sidebar/footer/types/FooterTypes.ts";
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
import { useAppStore } from "@/hooks/store/AppStore.ts";
import { IconDotsVertical } from "@tabler/icons-react";

/**
 * User navigation component for Sidebar
 *
 * @description Displays the user info and actions in sidebar
 */
export function UserButton({ onHandleClick }: Readonly<UserButtonProps>) {
  const { name, email, avatar, settings } = useSidebarDataContext().user;

  const isLoggedIn = useAppStore((state) => state.isLoggedIn);
  const user = useAppStore((state) => state.user);

  const userDisplay = {
    name: user?.name ?? name,
    email: user?.email ?? email,
    avatar: user?.avatar ?? avatar,
  };

  const userData = { settings, isLoggedIn };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground cursor-pointer"
            >
              <UserDisplay props={userDisplay} />
              <IconDotsVertical className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <TriggeredSettingsPopup
            userData={userData}
            userDisplay={userDisplay}
            onHandleClick={onHandleClick}
          />
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
