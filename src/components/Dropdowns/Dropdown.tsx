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
  const { title, icon: Icon, divider } = item;

  return (
    <>
      {divider && <DropdownMenuSeparator />}
      <Activity mode={item.showToUser ? "visible" : "hidden"}>
        <NavLink to={item.url ? item.url : "#"} replace={true}>
          <DropdownMenuItem disabled={!item.isActive}>
            {Icon && <Icon />}
            {title}
          </DropdownMenuItem>
        </NavLink>
      </Activity>
    </>
  );
}
