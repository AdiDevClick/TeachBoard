import type { COMPLETE_SIDEBAR_DATAS } from "@/configs/main.configs";
import { createContext } from "react";

/**
 * Context for Sidebar Data Provider
 */
export const SidebarDataContext = createContext<
  typeof COMPLETE_SIDEBAR_DATAS | null
>(null);
