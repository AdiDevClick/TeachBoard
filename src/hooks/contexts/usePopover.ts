import { PopoverFieldContext } from "@/api/contexts/Popover.context.ts";
import { use } from "react";

/**
 * Popover field context hook
 * @throws Error if used outside of PopoverField context
 */
export function usePopoverFieldContext() {
  const context = use(PopoverFieldContext);
  if (!context) {
    throw new Error(
      "usePopoverFieldContext must be used within a PopoverField"
    );
  }
  return context;
}

/**
 * Safe version of usePopoverFieldContext that returns null if outside context
 * Use this when CommandItems may be used outside of PopoverField
 */
export function usePopoverFieldContextSafe() {
  return use(PopoverFieldContext);
}
