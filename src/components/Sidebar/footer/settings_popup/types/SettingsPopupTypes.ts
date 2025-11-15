import type {
  dataContext,
  dataContextUser,
} from "@/api/providers/types/SidebarDataProviderTypes.ts";
import type { UserButtonProps } from "@/components/Sidebar/footer/types/FooterTypes.ts";
import type { AppStore } from "@/hooks/store/types/store.types.ts";

/**
 * User display fields for SettingsPopupProps
 */
type UserDisplay = "name" | "email" | "avatar";

/**
 * User data type for SettingsPopupProps
 */
type UserData = Omit<dataContextUser, UserDisplay> &
  Pick<dataContextUser, "settings"> &
  Pick<AppStore, "isLoggedIn">;

/** Props for the SettingsPopup component */
export type SettingsPopupProps = {
  userData: UserData;
  userDisplay: Pick<dataContext["user"], UserDisplay>;
  handleOnFooterButtonsClick: UserButtonProps["handleOnFooterButtonsClick"];
};
