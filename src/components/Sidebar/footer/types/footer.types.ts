import type { dataContextUser } from "@/api/providers/types/sidebar-data.provider.types.ts";
import type { DropdownsProps } from "@/components/Dropdowns/types/dropdowns.types";
import type { PropsWithChildren } from "react";

/** Props for the AvatarDisplay component */
export type AvatarDisplayProps = {
  props: Omit<dataContextUser, "settings">;
} & PropsWithChildren;

/** Props for the UserButton component */
export type UserButtonProps = Readonly<{
  onClick?: DropdownsProps["onClick"];
}>;
