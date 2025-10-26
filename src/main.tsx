import { SidebarDataProvider } from "@/api/providers/SidebarDataProvider.tsx";
import App from "@/App.tsx";
import { AppSidebar } from "@/components/Sidebar/Sidebar.tsx";
import { SidebarProvider } from "@/components/ui/sidebar.tsx";
import { calendarEvents } from "@/data/CalendarData.ts";
import { sidebarDatas } from "@/data/SidebarData";
import { About } from "@/pages/About/About.tsx";
import { PageError } from "@/pages/Error/PageError.tsx";
import { Home } from "@/pages/Home/Home.tsx";
import type { RootProps } from "@/types/MainTypes.ts";
import { StrictMode, type CSSProperties } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";

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

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <Root contentType="error" />,
    children: [
      { index: true, element: <Home />, loader: () => null },
      {
        path: "about",
        element: <About />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
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
export function Root({ contentType }: RootProps) {
  const errorContent = contentType === "error";

  return (
    <>
      <SidebarProvider
        style={
          {
            "--sidebar-width": "calc(var(--spacing) * 72)",
            "--header-height": "calc(var(--spacing) * 12)",
          } as CSSProperties
        }
      >
        <SidebarDataProvider value={CompleteDatas}>
          <AppSidebar variant="inset" />
          <App>{errorContent ? <PageError /> : <Outlet />}</App>
        </SidebarDataProvider>
      </SidebarProvider>
    </>
  );
}
