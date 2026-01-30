import { SidebarDataContext } from "@/api/contexts/SidebarData.context";
import type { SidebarDataProviderProps } from "@/api/providers/types/sidebar-data.provider.types";

/**
 * Sidebar Data Provider component
 *
 * @remarks This is used for Compound Components that need to access sidebar data
 *
 * @param value - The sidebar data context value
 * @param children - The child components
 *
 * @returns The Sidebar Data Provider component
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
