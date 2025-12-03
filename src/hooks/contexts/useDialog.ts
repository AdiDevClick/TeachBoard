import { DialogContext } from "@/api/contexts/Dialog.context";
import { use } from "react";

/**
 * Custom hook to use DialogContext
 *
 * @throws Error if used outside of DialogProvider
 */
export function useDialog() {
  const context = use(DialogContext);

  if (!context) {
    throw new Error("useDialog must be used within a DialogProvider");
  }

  return context;
}
