import type { COMPLETE_SIDEBAR_DATAS } from "@/configs/main.configs";
import type { ReactNode } from "react";

/**
 * Type for the sidebar data context
 *
 * @description Change this type if the structure of sidebarDatas changes
 */
export type dataContext = typeof COMPLETE_SIDEBAR_DATAS;
export type dataContextUser = dataContext["user"];
export type dataContextUserSettings = dataContext["user"]["settings"];

/** Props for the Sidebar Data Provider component */
export type SidebarDataProviderProps = {
  value: dataContext;
  children: ReactNode;
};
