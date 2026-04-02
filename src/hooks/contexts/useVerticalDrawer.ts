import { VerticalDrawer } from "@/api/contexts/VerticalDrawer.context";
import { use } from "react";

/**
 * Custom hook to access the VerticalDrawer context.
 *
 * @important Must be used within a VerticalDrawerProvider to ensure the context is available.
 *
 * @returns The current value of the VerticalDrawer context.
 *
 * @throws Will throw an error if used outside of a VerticalDrawerProvider.
 */
export function useVerticalDrawer() {
  const context = use(VerticalDrawer);

  if (!context) {
    throw new Error(
      "useVerticalDrawer must be used within a VerticalDrawerProvider",
    );
  }

  return context;
}
