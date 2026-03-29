import { VerticalDrawer } from "@/api/contexts/VerticalDrawer.context";
import type { VerticalDrawerProviderProps } from "@/api/providers/types/vertical-drawer.provider.types";

/**
 * Provider component for the VerticalDrawer context.
 *
 * @param value The value to be provided to the VerticalDrawer context.
 * @param children The child components that will have access to the VerticalDrawer context.
 */
export function VerticalDrawerProvider({
  value,
  children,
}: VerticalDrawerProviderProps) {
  return (
    <VerticalDrawer.Provider value={value}>{children}</VerticalDrawer.Provider>
  );
}
