import type { TriggeredSettingsPopup } from "@/components/Sidebar/footer/settings_popup/TriggeredSettingsPopup.tsx";
import type { sidebarDatas } from "@/data/SidebarData.ts";
import type { SafeListMapperProp } from "@/utils/types/types.utils.ts";
import type { ComponentProps } from "react";

/** Props for each item in the list */
type DropdownItem = (typeof sidebarDatas.user.settings)[number];

/** Details about the user data excluding settings */
type DropdownUserData = Omit<
  Parameters<typeof TriggeredSettingsPopup>[0]["userData"],
  "settings"
>;
// type DropdownUserData = Omit<
//   Parameters<typeof TriggeredSettingsPopup>[0]["userData"],
//   "settings"
// > & {
//   isUserConnected?: boolean;
// };

/**
 * @description The items do not inherently need user data, but it might not be displayed to the user if they are not connected.
 */
export type DropdownsProps = ComponentProps<"div"> &
  (
    | (DropdownItem & DropdownUserData)
    | SafeListMapperProp<DropdownItem & DropdownUserData>
  );
