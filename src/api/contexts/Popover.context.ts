import type { PopoverFieldContextType } from "@/api/providers/types/popover.provider.types.ts";
import { createContext } from "react";

/**
 * Context for Popover Field
 */
export const PopoverFieldContext = createContext<PopoverFieldContextType>(
  null!
);
