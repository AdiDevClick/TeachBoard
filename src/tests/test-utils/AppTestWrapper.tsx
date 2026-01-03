import { DialogProvider } from "@/api/providers/DialogProvider";
import { SidebarProvider } from "@/components/ui/sidebar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { type PropsWithChildren } from "react";
import { MemoryRouter } from "react-router-dom";

export const testQueryClient = new QueryClient();

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
