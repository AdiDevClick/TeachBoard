import type {
  dataContext,
  dataContextUser,
} from "@/api/providers/types/sidebar-data.provider.types";
import type { AppStore } from "@/api/store/types/app-store.types";
import type { UserButtonProps } from "@/components/Sidebar/footer/types/footer.types";

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
  avatarDisplay: Pick<dataContext["user"], UserDisplay>;
  handleOnFooterButtonsClick: UserButtonProps["handleOnFooterButtonsClick"];
};
