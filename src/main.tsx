import { DialogProvider } from "@/api/providers/DialogProvider.tsx";
import { SidebarDataProvider } from "@/api/providers/SidebarDataProvider.tsx";
import App from "@/App.tsx";
import { PageHeader } from "@/components/Header/PageHeader";
import { AppSidebar } from "@/components/Sidebar/Sidebar.tsx";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar.tsx";
import { Toaster } from "@/components/ui/sonner";
import { API_ENDPOINTS } from "@/configs/api.endpoints.config.ts";
import { calendarEvents } from "@/data/CalendarData.ts";
import { sidebarDatas } from "@/data/SidebarData";
import { useDialog } from "@/hooks/contexts/useDialog.ts";
import { useQueryOnSubmit } from "@/hooks/queries/useQueryOnSubmit.ts";
import { PageError } from "@/pages/Error/PageError.tsx";
import { routeChildren } from "@/routes/routes.config.tsx";
import type { RootProps } from "@/types/MainTypes";
import "@css/MainContainer.scss";
import "@css/Toaster.scss";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StrictMode, useEffect, useState, type CSSProperties } from "react";
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
  const [user, setUser] = useState<any>({});
  const { openDialog } = useDialog();
  const errorContent = contentType === "error";
  const { data, isLoading, queryFn, isLoaded, error } = useQueryOnSubmit([
    "session-check",
    {
      url: API_ENDPOINTS.POST.AUTH.SESSION_CHECK,
      method: "POST",
      successDescription: "Session checked successfully.",
    },
  ]);

  useEffect(() => {
    queryFn({});
  }, []);

  useEffect(() => {
    if (isLoading) {
      if (import.meta.env.DEV) {
        console.debug("Session Check Loading...");
      }
    }

    if (data) {
      setUser((prev) => ({ ...prev, isUserConnected: true, ...data }));
      if (import.meta.env.DEV) {
        console.debug("Session Check Data:", data);
      }
    }

    if (error) {
      // navigate("/login");
      openDialog("login");
      // openDialog({
      //   title: "Session Error",
      //   description: "There was an error with your session. Please log in again.",
      //   onClose: () => {
      //     closeDialog();
      //     navigate("/login");
      //   },
      // });
      if (import.meta.env.DEV) {
        console.error("Session Check Error:", error);
      }
    }
  }, [data, error, isLoading]);
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
        <AppSidebar variant="inset" user={user} />
        <SidebarInset className="main-app-container">
          <PageHeader />
          <App>{errorContent ? <PageError /> : <Outlet context={user} />}</App>
        </SidebarInset>
      </SidebarDataProvider>
    </SidebarProvider>
  );
}
