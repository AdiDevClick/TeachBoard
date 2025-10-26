import type { sidebarDatas } from "@/data/SidebarData.ts";
import type { ReactNode } from "react";

/**
 * Type for the sidebar data context
 *
 * @description Change this type if the structure of sidebarDatas changes
 */
export type dataContext = typeof sidebarDatas;

/** Props for the Sidebar Data Provider component */
export type SidebarDataProviderProps = {
  value: dataContext;
  children: ReactNode;
};
