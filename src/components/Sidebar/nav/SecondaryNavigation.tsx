"use client";

import { SidebarDataContext } from "@/api/contexts/SidebarDataContext.ts";
import { SecondaryMenuButton } from "@/components/Sidebar/nav/elements/menu_button/SecondaryMenuButton";
import { ButtonsGroupList } from "@/components/Sidebar/nav/elements/menu_group_list/ButtonsGroupList";
import type { SecondaryProps } from "@/components/Sidebar/nav/types/NavTypes.ts";
import { use } from "react";

/**
 * Secondary navigation menu
 *
 * @description Mainly used for links like Settings, Help, etc.
 * @param items - Props for the secondary menu
 * @param props - Additional props
 */
export function SecondaryNavigation({ ...props }: SecondaryProps) {
  const sidebar = use(SidebarDataContext);
  if (!sidebar) return null;

  const { navSecondary } = sidebar;

  return (
    <ButtonsGroupList {...props} items={navSecondary}>
      <SecondaryMenuButton />
    </ButtonsGroupList>
  );
}
