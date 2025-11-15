import type { dataContextUser } from "@/api/providers/types/SidebarDataProviderTypes.ts";
import type { MouseEvent } from "react";

/** Props for the UserDisplay component */
export type UserDisplayProps = {
  props: Omit<dataContextUser, "settings">;
};

/** Props for the UserButton component */
export type UserButtonProps = {
  onHandleClick: (e: MouseEvent<HTMLDivElement>) => void;
};
