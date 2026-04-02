import { DropdownLayoutContext } from "@/api/contexts/DropdownMenuLayout.context";
import type { DropdownMenuLayoutProviderProps } from "@/api/providers/types/dropdown-menu-layout.provider.types";

/**
 * Provider component for Dropdown Menu Layout context
 *
 * @param value - The value to be provided to the context
 * @param children - The child components that will consume the context
 */
export function DropdownLayoutProvider({
  value,
  children,
}: DropdownMenuLayoutProviderProps) {
  return (
    <DropdownLayoutContext.Provider value={value}>
      {children}
    </DropdownLayoutContext.Provider>
  );
}
