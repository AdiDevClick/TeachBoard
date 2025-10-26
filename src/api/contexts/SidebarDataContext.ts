import type { CompleteDatas } from "@/main.tsx";
import { createContext } from "react";

/**
 * Context for Sidebar Data
 */
export const SidebarDataContext = createContext<typeof CompleteDatas | null>(
  null
);
