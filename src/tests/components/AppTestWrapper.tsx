import { DialogProvider } from "@/api/providers/DialogProvider";
import { SidebarProvider } from "@/components/ui/sidebar";
import { testQueryClient } from "@/tests/test-utils/testQueryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { type PropsWithChildren } from "react";
import {
  createMemoryRouter,
  MemoryRouter,
  RouterProvider,
  type RouteObject,
} from "react-router-dom";

type AppTestWrapperProps = PropsWithChildren<{
  routes?: RouteObject[];
  initialEntries?: string[];
}>;

/**
 * AppTestWrapper component to provide necessary context for testing.
 *
 * @description You can use this wrapper to wrap your components in tests to provide necessary context such as routing, query client, dialogs, and sidebar.
 *
 * @param children - child components to be wrapped
 */
export function AppTestWrapper({
  children,
  routes,
  initialEntries = ["/"],
}: Readonly<AppTestWrapperProps>) {
  const router = routes
    ? createMemoryRouter(routes, {
        initialEntries,
      })
    : null;

  return (
    <DialogProvider>
      <QueryClientProvider client={testQueryClient}>
        <SidebarProvider>
          {routes && router ? (
            <RouterProvider router={router} />
          ) : (
            <MemoryRouter initialEntries={initialEntries}>
              {children}
            </MemoryRouter>
          )}
        </SidebarProvider>
      </QueryClientProvider>
    </DialogProvider>
  );
}
