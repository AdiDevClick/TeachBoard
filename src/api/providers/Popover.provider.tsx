import { PopoverFieldContext } from "@/api/contexts/Popover.context.ts";
import { type PropsWithChildren, useMemo } from "react";

/**
 * Provider component with memoized value
 *
 * @description Used as a default provider in {@link PopoverField} to pass down the onSelect function via context.
 *
 * @param onSelect - Function to handle selection of a value
 * @param selectedValue - Currently selected value
 * @param children - Child components that will have access to the context
 */
export function PopoverFieldProvider({
  onSelect,
  selectedValue,
  children,
}: {
  onSelect: (value: string) => void;
  selectedValue?: string;
} & PropsWithChildren) {
  const value = useMemo(() => ({ onSelect, selectedValue }), [onSelect, selectedValue]);
  return (
    <PopoverFieldContext.Provider value={value}>
      {children}
    </PopoverFieldContext.Provider>
  );
}
