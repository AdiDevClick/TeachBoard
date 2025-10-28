import type { dataContext } from "@/api/providers/types/SidebarDataProviderTypes.ts";

export type SettingsPopupProps = {
  isMobile: boolean;
  userData: dataContext["user"];
};
