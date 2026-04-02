import type { DropdownMenuLayoutContextType } from "@/api/contexts/types/context.types";
import type { PropsWithChildren } from "react";

/**
 * Props for Dropdown Menu Layout Provider component
 */
export type DropdownMenuLayoutProviderProps = {
  value: DropdownMenuLayoutContextType;
} & PropsWithChildren;
