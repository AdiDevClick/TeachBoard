import type { ViewCardContextType } from "@/api/contexts/types/context.types.ts";
import type { PropsWithChildren } from "react";

/**
 * Props for View Card Provider component
 */
export type ViewCardProviderProps = {
  value: ViewCardContextType;
} & PropsWithChildren;
