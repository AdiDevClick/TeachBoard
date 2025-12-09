import type {
  PopoverFieldProps,
  PopoverFieldState,
} from "@/components/Popovers/types/popover.types.ts";
import type { PropsWithChildren } from "react";

/**
 * Props for the Popover Field Provider component
 */
export type PopoverFieldContextType = {
  onSelect: PopoverFieldProps["onSelect"];
  selectedValue?: PopoverFieldState["selectedValue"];
} & PropsWithChildren;
