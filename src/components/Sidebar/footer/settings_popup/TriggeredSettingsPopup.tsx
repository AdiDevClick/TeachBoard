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

export function TriggeredSettingsPopup({
  isMobile,
  sidebar,
}: SettingsPopupProps) {
  const user = sidebar.user;
  const settings = user.settings;

  return (
    <DropdownMenuContent
      className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
      side={isMobile ? "bottom" : "right"}
      align="end"
      sideOffset={4}
    >
      <DropdownMenuLabel className="p-0 font-normal">
        <UserDisplay props={user} />
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
