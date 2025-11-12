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
import { Activity } from "react";

/**
 * Full App Sidebar component
 *
 * @param props - Component props
 */
export function AppSidebar({ user, ...props }: SidebarProps) {
  const { state } = useSidebar();

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
        <UserButton user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
