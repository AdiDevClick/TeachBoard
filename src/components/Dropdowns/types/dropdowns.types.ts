import type { TriggeredSettingsPopup } from "@/components/Sidebar/footer/settings_popup/TriggeredSettingsPopup.tsx";
import type { sidebarDatas } from "@/data/SidebarData.ts";
import type { DropdownMenuItemProps } from "@radix-ui/react-dropdown-menu";
import type { MouseEvent } from "react";

/** Props for each item in the list */
type DropdownItem = (typeof sidebarDatas.user.settings)[number];

/** Details about the user data excluding settings */
type DropdownUserData = Omit<
  Parameters<typeof TriggeredSettingsPopup>[0]["userData"],
  "settings"
>;

/** Combined type for Dropdown props */
type DropdownStandAloneData = DropdownItem & DropdownUserData;

export type DropDownItemClickDetails = {
  e: MouseEvent<HTMLDivElement>;
  title: DropdownItem["title"];
  url?: DropdownItem["url"];
};

/**
 * @description The items do not inherently need user data, but it might not be displayed to the user if they are not connected.
 */
export type DropdownsProps = Readonly<
  DropdownMenuItemProps & {
    onClick?: (data?: DropDownItemClickDetails) => void;
  } & DropdownStandAloneData
>;
