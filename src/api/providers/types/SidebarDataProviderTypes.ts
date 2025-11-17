import type { completeDatas } from "@/main.tsx";
import type { ReactNode } from "react";

/**
 * Type for the sidebar data context
 *
 * @description Change this type if the structure of sidebarDatas changes
 */
export type dataContext = typeof completeDatas;
export type dataContextUser = dataContext["user"];
export type dataContextUserSettings = dataContext["user"]["settings"];

/** Props for the Sidebar Data Provider component */
export type SidebarDataProviderProps = {
  value: dataContext;
  children: ReactNode;
};
