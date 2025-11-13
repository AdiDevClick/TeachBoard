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
export function Dropdown({ ...item }: Readonly<DropdownsProps>) {
  if (!item) {
    throw new Error("Dropdown item data is required");
  }

  const { title, icon: Icon, divider, url, isUserConnected } = item;

  const itemVisible = isUserConnected
    ? item.displayWhenConnected
    : item.showToUserWhenNotConnected;
  const itemIsActive = isUserConnected
    ? item.displayWhenConnected
    : item.isActivated;
  const isUrlActive = itemVisible && itemIsActive;

  return (
    <>
      {divider && <DropdownMenuSeparator />}
      <Activity mode={itemVisible ? "visible" : "hidden"}>
        <NavLink to={isUrlActive ? url ?? "#" : "#"} replace={true}>
          <DropdownMenuItem disabled={!itemIsActive}>
            {Icon && <Icon />}
            {title ?? "untitled"}
          </DropdownMenuItem>
        </NavLink>
      </Activity>
    </>
  );
}
