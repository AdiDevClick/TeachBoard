import type { ViewCardContextType } from "@/api/contexts/types/context.types.ts";
import { createContext } from "react";

/**
 * Context that exposes view-related state and actions for card components.
 *
 * @see ViewCardContextType - describes the shape of the context value.
 */
export const ViewCardContext = createContext<ViewCardContextType>(undefined);
