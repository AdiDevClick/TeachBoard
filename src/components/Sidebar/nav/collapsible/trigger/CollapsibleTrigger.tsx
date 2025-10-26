import { CollapsibleTrigger } from "@radix-ui/react-collapsible";
import type { ReactNode } from "react";

/**
 * Collapsible trigger component for the sidebar.
 *
 * @param children - The children to render inside the trigger.
 * @returns The collapsible trigger component.
 */
export default function SidebarCollapsibleTrigger({
  children,
}: {
  children: ReactNode;
}) {
  return <CollapsibleTrigger asChild>{children}</CollapsibleTrigger>;
}
