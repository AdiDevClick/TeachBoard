import { AvatarDisplay } from "@/components/Avatar/AvatarDisplay";
import { DropdownList } from "@/components/Dropdowns/exports/dropdown.exports";
import type { SettingsPopupProps } from "@/components/Sidebar/footer/settings_popup/types/settings-popup.types";
import {
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useSidebar } from "@/components/ui/sidebar.tsx";
import "@css/DropdownMenu.scss";

/**
 * Settings popup component for Sidebar footer
 *
 * @param isMobile - Indicates if the sidebar is in mobile view
 * @param userData - User data from sidebar context
 */
export function TriggeredSettingsPopup({
  userData,
  avatarDisplay,
}: Readonly<SettingsPopupProps>) {
  const { isMobile } = useSidebar();
  const { settings, ...rest } = userData;

  return (
    <DropdownMenuContent
      className="dropdown-menu-container"
      side={isMobile ? "bottom" : "right"}
      align="end"
      sideOffset={4}
    >
      <DropdownMenuLabel className="menu__label">
        <AvatarDisplay props={avatarDisplay} />
      </DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        <DropdownList items={settings} optional={{ ...rest }} />
      </DropdownMenuGroup>
    </DropdownMenuContent>
  );
}
