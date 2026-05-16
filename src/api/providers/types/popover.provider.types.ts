import type { CommandItemType } from "@/components/Command/types/command.types";
import type { PopoverSelectionValue } from "@/components/Popovers/types/popover.types";
import type { PropsWithChildren } from "react";

/**
 * Props for the Popover Field Provider component
 */
export type PopoverFieldContextType = {
  /**
   * This allows consumers to handle the selection event and update their state accordingly.
   */
  onSelect: (value: string, commandItem?: CommandItemType) => void;
  /**
   * The currently selected value(s). This should be a string for single selection mode, or a Set of strings for multi-selection mode
   */
  selectedValue?: PopoverSelectionValue;
  /**
   * Optional function to request the Popover to close.
   * Use this when the consumer wants to close the Popover without
   * invoking the selection/update handler (or when it cannot provide
   * the full selection payload expected by `onSelect`).
   */
  close?: () => void;
} & PropsWithChildren;
