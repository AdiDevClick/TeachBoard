import { PopoverFieldContext } from "@/api/contexts/Popover.context.ts";
import type { PopoverFieldContextType } from "@/api/providers/types/popover.provider.types.ts";
import { useMemo } from "react";

/**
 * Provider component with memoized value
 *
 * @description Used as a default provider in {@link PopoverField} to pass down the onSelect function via context.
 *
 * @param onSelect - Function to handle selection of a value
 * @param selectedValue - Currently selected value
 * @param children - Child components that will have access to the context
 */
export function PopoverFieldProvider(props: PopoverFieldContextType) {
  const { onSelect, selectedValue } = props;
  const value = useMemo(
    () => ({ onSelect, selectedValue }),
    [onSelect, selectedValue]
  );
  return (
    <PopoverFieldContext.Provider value={value}>
      {props.children}
    </PopoverFieldContext.Provider>
  );
}
