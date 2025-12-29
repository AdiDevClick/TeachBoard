import type { completeDatas } from "@/main.tsx";
import { createContext } from "react";

/**
 * Context for Sidebar Data Provider
 */
export const SidebarDataContext = createContext<typeof completeDatas | null>(
  null
);
