import type { dataContextUser } from "@/api/providers/types/sidebar-data.provider.types";
import type { MouseEventHandler, PropsWithChildren } from "react";

/** Props for the AvatarDisplay component */
export type AvatarDisplayProps = {
  props: Omit<dataContextUser, "settings">;
} & PropsWithChildren;

/** Props for the UserButton component */
export type UserButtonProps = {
  handleOnFooterButtonsClick: MouseEventHandler<HTMLDivElement>;
};
