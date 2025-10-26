import { SidebarDataContext } from "@/api/contexts/SidebarDataContext.ts";
import type { SidebarDataProviderProps } from "@/api/providers/types/SidebarDataProviderTypes.ts";

/**
 * Sidebar Data Provider component
 */
export function SidebarDataProvider({
  value,
  children,
}: SidebarDataProviderProps) {
  return (
    <SidebarDataContext.Provider value={value}>
      {children}
    </SidebarDataContext.Provider>
  );
}
