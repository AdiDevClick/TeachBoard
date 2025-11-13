import type { dataContext } from "@/api/providers/types/SidebarDataProviderTypes.ts";

type UserDisplay = "name" | "email" | "avatar";

/** Props for the SettingsPopup component */
export type SettingsPopupProps = {
  userData: Omit<dataContext["user"], UserDisplay>;
  userDisplay: Pick<dataContext["user"], UserDisplay>;
};
