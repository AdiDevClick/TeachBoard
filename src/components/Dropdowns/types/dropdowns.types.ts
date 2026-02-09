import type { TriggeredSettingsPopup } from "@/components/Sidebar/footer/settings_popup/TriggeredSettingsPopup.tsx";
import type { sidebarDatas } from "@/data/SidebarData.ts";
import type { SafeListMapperProp } from "@/utils/types/types.utils.ts";
import type { DropdownMenuItemProps } from "@radix-ui/react-dropdown-menu";
import type { MouseEvent, RefAttributes } from "react";

/** Props for each item in the list */
type DropdownItem = (typeof sidebarDatas.user.settings)[number];

/** Details about the user data excluding settings */
type DropdownUserData = Omit<
  Parameters<typeof TriggeredSettingsPopup>[0]["userData"],
  "settings"
>;

/** Combined type for Dropdown props */
type DropdownStandAloneData = DropdownItem & DropdownUserData;

/** Combined type for Dropdown props when used with ListMapper */
type DropdownMappedData = SafeListMapperProp<DropdownItem> & DropdownUserData;

export type DropDownItemClickDetails = {
  e?: MouseEvent<HTMLDivElement>;
  title?: DropdownItem["title"];
  url?: DropdownItem["url"];
};

/**
 * @description The items do not inherently need user data, but it might not be displayed to the user if they are not connected.
 */
export type DropdownsProps = DropdownMenuItemProps & {
  onClick?: (data?: DropDownItemClickDetails) => void;
} & RefAttributes<HTMLDivElement> &
  (DropdownStandAloneData | DropdownMappedData);
