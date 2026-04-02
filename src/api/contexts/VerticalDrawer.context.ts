import type { VerticalDrawerContext } from "@/api/contexts/types/context.types";
import { createContext } from "react";

/**
 * Context for managing the state of the VerticalDrawer component.
 */
export const VerticalDrawer = createContext<VerticalDrawerContext>(null!);
