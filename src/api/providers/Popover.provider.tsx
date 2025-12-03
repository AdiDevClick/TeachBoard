import { PopoverFieldContext } from "@/api/contexts/Popover.context.ts";
import { type PropsWithChildren, useMemo } from "react";

/**
 * Provider component with memoized value
 *
 * @description Used as a default provider in {@link PopoverField} to pass down the onSelect function via context.
 *
 * @param onSelect - Function to handle selection of a value
 * @param children - Child components that will have access to the context
 */
export function PopoverFieldProvider({
  onSelect,
  children,
}: {
  onSelect: (value: string) => void;
} & PropsWithChildren) {
  const value = useMemo(() => ({ onSelect }), [onSelect]);
  return (
    <PopoverFieldContext.Provider value={value}>
      {children}
    </PopoverFieldContext.Provider>
  );
}
