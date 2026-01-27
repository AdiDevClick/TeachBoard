import { ViewCardContext } from "@/api/contexts/ViewCard.context.ts";
import type { ViewCardProviderProps } from "@/api/providers/types/view-card.provider.types.ts";

/**
 * View Card Provider component
 *
 * @remarks This uses the Compound Component Pattern.
 *
 *
 * @description Use this provider to supply the view card structure with custom data.
 *
 * @param value - The value to be provided to the context.
 * @param children - The child components that will consume the context.
 */
export function ViewCardProvider({ value, children }: ViewCardProviderProps) {
  return (
    <ViewCardContext.Provider value={value}>
      {children}
    </ViewCardContext.Provider>
  );
}
