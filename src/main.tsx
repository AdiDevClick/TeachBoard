import { DialogProvider } from "@/api/providers/DialogProvider.tsx";
import { SidebarDataProvider } from "@/api/providers/SidebarDataProvider.tsx";
import App from "@/App.tsx";
import { PageHeader } from "@/components/Header/PageHeader";
import { AppSidebar } from "@/components/Sidebar/Sidebar.tsx";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar.tsx";
import { Toaster } from "@/components/ui/sonner";
import { DEV_MODE } from "@/configs/app.config.ts";
import { calendarEvents } from "@/data/CalendarData.ts";
import { sidebarDatas } from "@/data/SidebarData.ts";
import { useDialog } from "@/hooks/contexts/useDialog.ts";
import { useSessionChecker } from "@/hooks/database/sessions/useSessionChecker.ts";
import { useAppStore } from "@/hooks/store/AppStore.ts";
import { PageError } from "@/pages/Error/PageError.tsx";
import { routeChildren } from "@/routes/routes.config.tsx";
import type { RootProps } from "@/types/MainTypes";
import "@css/MainContainer.scss";
import "@css/Toaster.scss";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StrictMode, useEffect, useMemo, type CSSProperties } from "react";
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
export const completeDatas = {
  ...sidebarDatas,
  calendarEvents: calendarEvents,
};

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
    <DialogProvider>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <Toaster
          position="top-right"
          className={"toaster-redefined"}
          richColors
          closeButton
        />
      </QueryClientProvider>
    </DialogProvider>
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

  const user = useAppStore((state) => state.user);
  const lastUserActivity = useAppStore((state) => state.lastUserActivity);
  const { openDialog } = useDialog();

  const { data, isLoading, queryFn, isLoaded, error } = useSessionChecker();

  useEffect(() => {
    if (isLoaded || lastUserActivity === "logout" || user?.isLoggedIn) return;

    queryFn();
  }, [isLoaded, user, lastUserActivity]);

  useEffect(() => {
    if (isLoading) {
      if (DEV_MODE) {
        console.debug("Session Check Loading...");
      }
    }

    if (data && !user?.isLoggedIn) {
      if (DEV_MODE) {
        console.debug("Session Check Data:", data);
      }
    }

    if (error) {
      openDialog("login");
      if (DEV_MODE) {
        console.error("Session Check Error:", error);
      }
    }
  }, [data, error, isLoading, user]);

  const userData = useMemo(() => {
    const userCopy = { ...completeDatas.user, ...user };
    return { ...completeDatas, user: userCopy };
  }, [user]);

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
      <SidebarDataProvider value={userData}>
        <AppSidebar variant="inset" />
        <SidebarInset className="main-app-container">
          <PageHeader />
          <App>
            {errorContent ? <PageError /> : <Outlet context={userData} />}
          </App>
        </SidebarInset>
      </SidebarDataProvider>
    </SidebarProvider>
  );
}
