import { DialogProvider } from "@/api/providers/DialogProvider";
import { SidebarProvider } from "@/components/ui/sidebar";
import { testQueryClient } from "@/tests/test-utils/testQueryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { type PropsWithChildren } from "react";
import { MemoryRouter } from "react-router-dom";

/**
 * AppTestWrapper component to provide necessary context for testing.
 *
 * @description You can use this wrapper to wrap your components in tests to provide necessary context such as routing, query client, dialogs, and sidebar.
 *
 * @param children - child components to be wrapped
 */
export function AppTestWrapper({
  children,
}: Readonly<PropsWithChildren<unknown>>) {
  return (
    <DialogProvider>
      <QueryClientProvider client={testQueryClient}>
        <MemoryRouter initialEntries={["/"]}>
          <SidebarProvider>{children}</SidebarProvider>
        </MemoryRouter>
      </QueryClientProvider>
    </DialogProvider>
  );
}
