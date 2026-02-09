import type { DropdownsProps } from "@/components/Dropdowns/types/dropdowns.types";
import {
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu.tsx";
import {
  debugLogs,
  dropdownPropsInvalid,
} from "@/configs/app-components.config";
import { Activity, type MouseEvent } from "react";
import { NavLink } from "react-router-dom";

/**
 * Dropdown component for rendering a single dropdown item.
 * @param item - The dropdown item to render.
 * @returns The rendered dropdown item.
 */
export function Dropdown(item: Readonly<DropdownsProps>) {
  if (dropdownPropsInvalid(item)) {
    debugLogs("Dropdown", item);
    throw new Error("Dropdown item data is required");
  }

  const {
    title = "untitled",
    icon: Icon,
    divider,
    url = "#",
    isLoggedIn,
    isActivated,
    displayWhenConnected,
    showToUserWhenNotConnected,
    onClick: externalClick,
    ...rest
  } = item;

  const itemVisible = isLoggedIn
    ? displayWhenConnected
    : showToUserWhenNotConnected;
  const itemIsActive = isLoggedIn ? displayWhenConnected : isActivated;

  const isUrlActive = itemVisible && itemIsActive;

  const handleClick = (e: MouseEvent<HTMLDivElement>) => {
    if (isUrlActive) {
      externalClick?.({ e, title, url });
    } else {
      e.preventDefault();
    }
  };

  return (
    <>
      {divider && <DropdownMenuSeparator />}
      <Activity mode={itemVisible ? "visible" : "hidden"}>
        <NavLink to={isUrlActive ? url : "#"} replace={true}>
          <DropdownMenuItem
            className="menu__item"
            {...rest}
            disabled={!itemIsActive}
            onClick={handleClick}
          >
            {Icon && <Icon />}
            {title}
          </DropdownMenuItem>
        </NavLink>
      </Activity>
    </>
  );
}
