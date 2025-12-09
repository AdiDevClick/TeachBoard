import { SidebarDataContext } from "@/api/contexts/SidebarData.context";
import type { SidebarDataProviderProps } from "@/api/providers/types/sidebar-data.provider.types";

/**
 * Sidebar Data Provider component
 */
export function SidebarDataProvider({
  value,
  children,
}: Readonly<SidebarDataProviderProps>) {
  return (
    <SidebarDataContext.Provider value={value}>
      {children}
    </SidebarDataContext.Provider>
  );
}
