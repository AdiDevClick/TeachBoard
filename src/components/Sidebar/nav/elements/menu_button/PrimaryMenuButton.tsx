import type { MenuContentProps } from "@/components/Sidebar/nav/types/NavTypes.ts";
import { SidebarMenuButton } from "@/components/ui/sidebar.tsx";
import {
  debugLogs,
  menuButtonContainsInvalid,
} from "@/configs/app-components.config.ts";
import "@css/SidebarButtons.scss";
import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

/**
 * Menu button component for sidebar menu items.
 * Passing a submenu will display a chevron icon.
 *
 * @description This can be used as the trigger for collapsible menu items in the sidebar.
 *
 * @param item Menu item to display
 * @param setStyle Function to set style&
 */
export default function PrimaryMenuButton(props: MenuContentProps) {
  if (menuButtonContainsInvalid(props as unknown as Record<string, unknown>)) {
    debugLogs("PrimaryMenuButton", {
      type: "propsValidation",
      message: "Will render null due to invalid props",
      props,
    });
    return null;
  }

  const {
    item: {
      url,
      tooltip,
      title,
      quickButton,
      isActivated,
      subMenus,
      icon: Icon,
    },
    setStyle = () => "",
    ...rest
  } = props;
  const isQuickButtonEnabled = quickButton?.enabled;

  if (isActivated === false) {
    return null;
  }

  const style = setStyle({
    isQuickButtonEnabled,
    isMenu: false,
  });

  return (
    <Link to={url ?? "#"} className="w-full">
      <SidebarMenuButton
        {...rest}
        className={`sidebarButton--menu ${style} ${rest.className ?? ""}`}
        tooltip={tooltip}
      >
        {Icon && <Icon className="sidebarButton--menu-icon" />}
        <p>{title}</p>
        {subMenus && <ChevronRight className="sidebarButton--submenu" />}
      </SidebarMenuButton>
    </Link>
  );
}
