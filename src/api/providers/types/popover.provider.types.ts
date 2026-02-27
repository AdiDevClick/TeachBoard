import type { CommandSelectionItemProps } from "@/components/Command/types/command.types";
import type { PopoverSelectionValue } from "@/components/Popovers/types/popover.types";
import type { PropsWithChildren } from "react";

/**
 * Props for the Popover Field Provider component
 */
export type PopoverFieldContextType = {
  /**
   * This allows consumers to handle the selection event and update their state accordingly.
   */
  onSelect: CommandSelectionItemProps["onSelect"];
  /**
   * The currently selected value(s). This should be a string for single selection mode, or a Set of strings for multi-selection mode
   */
  selectedValue?: PopoverSelectionValue;
} & PropsWithChildren;
