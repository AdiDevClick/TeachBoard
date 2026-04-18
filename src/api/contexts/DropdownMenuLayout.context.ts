import type { DropdownMenuLayoutContextType } from "@/api/contexts/types/context.types";
import { createContext } from "react";

/**
 * Context for Dropdown Menu Layout, providing necessary data and functions to manage the layout of dropdown menus within the application.
 *
 * This context is designed to be used with the Compound Component pattern, allowing components like DropdownMenu, DropdownMenuTrigger, and DropdownMenuContent to access shared state and properties related to dropdown menu layouts.
 */
export const DropdownLayoutContext = createContext<
  DropdownMenuLayoutContextType<any>
>(null!);
