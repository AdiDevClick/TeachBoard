import type { DialogContextType } from "@/api/contexts/types/context.types.ts";
import { createContext } from "react";

/**
 * Context for Dialog component
 */
export const DialogContext = createContext<DialogContextType | undefined>(
  undefined
);
