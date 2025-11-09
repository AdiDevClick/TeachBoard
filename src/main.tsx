import { SidebarDataProvider } from "@/api/providers/SidebarDataProvider.tsx";
import App from "@/App.tsx";
import { PageHeader } from "@/components/Header/PageHeader";
import { AppSidebar } from "@/components/Sidebar/Sidebar.tsx";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar.tsx";
import { Toaster } from "@/components/ui/sonner";
import { calendarEvents } from "@/data/CalendarData.ts";
import { sidebarDatas } from "@/data/SidebarData";
import { PageError } from "@/pages/Error/PageError.tsx";
import { routeChildren } from "@/routes/routes.config.tsx";
import type { RootProps } from "@/types/MainTypes.ts";
import "@css/MainContainer.scss";
import "@css/Toaster.scss";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StrictMode, type CSSProperties } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";

const queryClient = new QueryClient();

/**
 * Complete sidebar data including calendar events
 *
 * @description This object merges the static sidebar data with
 * dynamic calendar events to provide a comprehensive data set
 * for the sidebar navigation.
 */
export const CompleteDatas = {
  ...sidebarDatas,
  calendarEvents: calendarEvents,
} as const;

/**
 * Application router configuration
 *
 * @description !! IMPORTANT !! Routes object is imported from {@link routeChildren}
 */
const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <Root contentType="error" />,
    children: routeChildren,
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>
);

/**
 * Root component to wrap all pages
 *
 * @description If contentType is "error", render the error page
 *
 * @param contentType - type of content to render
 * @returns
 */
export function Root({ contentType }: Readonly<RootProps>) {
  const errorContent = contentType === "error";

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
          paddingInline: 5,
        } as CSSProperties
      }
      className="sidebar-wrapper"
    >
      <SidebarDataProvider value={CompleteDatas}>
        <AppSidebar variant="inset" />
        <SidebarInset className="main-app-container">
          <PageHeader />
          <App>{errorContent ? <PageError /> : <Outlet context={null} />}</App>
          <Toaster
            position="top-right"
            className={"toaster-redefined"}
            richColors
            closeButton
          />
        </SidebarInset>
      </SidebarDataProvider>
    </SidebarProvider>
  );
}
