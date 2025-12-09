import type { dataContextUser } from "@/api/providers/types/sidebar-data.provider.types";
import type { MouseEventHandler } from "react";

/** Props for the UserDisplay component */
export type UserDisplayProps = {
  props: Omit<dataContextUser, "settings">;
};

/** Props for the UserButton component */
export type UserButtonProps = {
  handleOnFooterButtonsClick: MouseEventHandler<HTMLDivElement>;
};
