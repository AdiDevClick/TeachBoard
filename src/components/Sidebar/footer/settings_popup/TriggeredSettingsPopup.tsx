import { Dropdown } from "@/components/Dropdowns/Dropdown.tsx";
import { ListMapper } from "@/components/Lists/ListMapper.tsx";
import type { SettingsPopupProps } from "@/components/Sidebar/footer/settings_popup/types/SettingsPopupTypes.ts";
import { UserDisplay } from "@/components/Sidebar/footer/UserDisplay.tsx";
import {
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import "@css/DropdownMenu.scss";

/**
 * Settings popup component for Sidebar footer
 *
 * @param isMobile - Indicates if the sidebar is in mobile view
 * @param userData - User data from sidebar context
 */
export function TriggeredSettingsPopup({
  isMobile,
  userData,
}: SettingsPopupProps) {
  const settings = userData.settings;

  return (
    <DropdownMenuContent
      className="dropdown-menu-container"
      side={isMobile ? "bottom" : "right"}
      align="end"
      sideOffset={4}
    >
      <DropdownMenuLabel className="menu__label">
        <UserDisplay props={userData} />
      </DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        <ListMapper items={settings}>
          <Dropdown />
        </ListMapper>
      </DropdownMenuGroup>
    </DropdownMenuContent>
  );
}
