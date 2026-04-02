import { DropdownLayoutContext } from "@/api/contexts/DropdownMenuLayout.context";
import { useContext } from "react";

/**
 * Custom hook to access the DropdownMenuLayout context.
 */
export function useDropdownMenuLayoutContext() {
  const context = useContext(DropdownLayoutContext);

  if (!context) {
    throw new Error(
      "useDropdownMenuLayoutContext must be used within a DropdownLayoutProvider",
    );
  }
  return context;
}
