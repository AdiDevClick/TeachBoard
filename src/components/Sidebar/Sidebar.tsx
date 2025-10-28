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

/**
 * Full App Sidebar component
 *
 * @param props - Component props
 */
export function AppSidebar({ ...props }: SidebarProps) {
  const { state } = useSidebar();

  return (
    <Sidebar collapsible="icon" {...props}>
      <Header />
      <SidebarContent>
        <MainNavigation />
        <GroupSeparator />
        {state === "expanded" && (
          <>
            <SidebarCalendar className="card-container" />
            {/* <NavDocuments items={documents} /> */}
            <GroupSeparator />
          </>
        )}
        <SecondaryNavigation className="pb-5" />
      </SidebarContent>
      <SidebarFooter>
        <UserButton />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
