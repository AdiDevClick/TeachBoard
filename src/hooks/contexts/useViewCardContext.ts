import { ViewCardContext } from "@/api/contexts/ViewCard.context.ts";
import { useContext } from "react";

/**
 * Hook to access the ViewCard context
 *
 * @throws Will throw an error if used outside of a ViewCardProvider
 */
export function useViewCardContext() {
  const context = useContext(ViewCardContext);
  if (!context) {
    throw new Error(
      "[useViewCardContext] must be used within a ViewCardProvider",
    );
  }
  return context;
}
