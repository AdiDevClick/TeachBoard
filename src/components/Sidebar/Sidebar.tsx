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
} from "@/components/ui/sidebar";

/**
 * Full App Sidebar component
 *
 * @param props - Component props
 * @returns
 */
export function AppSidebar({ ...props }: SidebarProps) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <Header />
      <SidebarContent>
        <MainNavigation />
        <GroupSeparator />
        <SidebarCalendar className="card-container" />
        {/* <NavDocuments items={documents} /> */}
        <GroupSeparator />
        <SecondaryNavigation />
      </SidebarContent>
      <SidebarFooter>
        <UserButton />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
