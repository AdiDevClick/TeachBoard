import type { DropdownsProps } from "@/components/Dropdowns/types/DropdownsTypes.ts";
import {
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu.tsx";
import { Activity } from "react";
import { NavLink } from "react-router-dom";

/**
 * Dropdown component for rendering a single dropdown item.
 * @param item - The dropdown item to render.
 * @returns The rendered dropdown item.
 */
export function Dropdown({ ...item }: DropdownsProps) {
  const { title, icon: Icon, divider, url, userData } = item;

  let itemIsActive = item.isActivated;
  let itemVisible = item.showToUserWhenNotConnected;
  let isUrlActive = itemVisible && item.isActivated;

  const userIsConnected = userData?.isUserConnected ?? false;

  if (userIsConnected) {
    itemVisible = item.displayWhenConnected;
    itemIsActive = item.displayWhenConnected;
    isUrlActive = item.displayWhenConnected;
  }

  return (
    <>
      {divider && <DropdownMenuSeparator />}
      <Activity mode={itemVisible ? "visible" : "hidden"}>
        <NavLink to={isUrlActive ? url ?? "#" : "#"} replace={true}>
          <DropdownMenuItem disabled={!itemIsActive}>
            {Icon && <Icon />}
            {title}
          </DropdownMenuItem>
        </NavLink>
      </Activity>
    </>
  );
}
