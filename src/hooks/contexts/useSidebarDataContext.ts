import { SidebarDataContext } from "@/api/contexts/SidebarData.context";
import { use } from "react";

/**
 * Custom hook to use SidebarDataContext
 *
 * @throws Error if used outside of SidebarDataProvider
 */
export const useSidebarDataContext = () => {
  const context = use(SidebarDataContext);

  if (!context) {
    throw new Error(
      "useSidebarDataContext must be used within a SidebarDataProvider"
    );
  }

  return context;
};
