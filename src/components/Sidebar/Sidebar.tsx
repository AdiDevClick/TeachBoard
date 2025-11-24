import SidebarCalendar from "@/components/Sidebar/calendar/SidebarCalendar.tsx";
import { UserButton } from "@/components/Sidebar/footer/UserButton.tsx";
import GroupSeparator from "@/components/Sidebar/group_separator/GroupSeparator.tsx";
import Header from "@/components/Sidebar/header/Header.tsx";
import { MainNavigation } from "@/components/Sidebar/nav/MainNavigation";
import { SecondaryNavigation } from "@/components/Sidebar/nav/SecondaryNavigation";
import type { SidebarProps } from "@/components/Sidebar/types/SidebarTypes.ts";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import { useUserLogout } from "@/hooks/database/logout/useUserLogout.ts";
import { preventDefaultAndStopPropagation } from "@/utils/utils.ts";
import { Activity, type MouseEvent } from "react";

/**
 * Full App Sidebar component
 *
 * @param props - Component props
 */
export function AppSidebar({ ...props }: SidebarProps) {
  const { state } = useSidebar();
  const onSubmit = useUserLogout().onSubmit;

  const handleOnFooterButtonsClick = (e: MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    const parentElement = target.parentElement as HTMLAnchorElement;

    if (parentElement?.href.includes("/logout")) {
      preventDefaultAndStopPropagation(e);
      onSubmit();
    }
  };

  return (
    <Sidebar
      collapsible="icon"
      className="sidebar-collapsible-container"
      {...props}
    >
      <Header />
      <SidebarContent>
        <MainNavigation />
        <GroupSeparator />
        <Activity mode={state === "expanded" ? "visible" : "hidden"}>
          <SidebarCalendar className="card-container" />
          {/* <NavDocuments items={documents} /> */}
          <GroupSeparator />
        </Activity>
        <SecondaryNavigation className="pb-5" />
      </SidebarContent>
      <SidebarFooter>
        <UserButton handleOnFooterButtonsClick={handleOnFooterButtonsClick} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
