import { DialogProvider } from "@/api/providers/DialogProvider.tsx";
import { SidebarDataProvider } from "@/api/providers/SidebarDataProvider.tsx";
import App from "@/App.tsx";
import { PageHeader } from "@/components/Header/PageHeader";
import { PageTitle } from "@/components/Header/PageTitle";
import { AppSidebar } from "@/components/Sidebar/Sidebar.tsx";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar.tsx";
import { Toaster } from "@/components/ui/sonner";
import { Spinner } from "@/components/ui/spinner";
import { COMPLETE_SIDEBAR_DATAS } from "@/configs/main.configs";
import { useSessionChecker } from "@/hooks/database/sessions/useSessionChecker.ts";
import { drawers } from "@/pages/AllDrawers/configs/drawers.configs";
import { AppDrawers } from "@/pages/AllDrawers/exports/drawers.exports";
import { AppModals } from "@/pages/AllModals/AppModals.tsx";
import { PageError } from "@/pages/Error/PageError.tsx";
import { ROUTES_CHILDREN } from "@/routes/routes";
import type { AppContent, AppContentProps, RootProps } from "@/types/MainTypes";
import "@css/MainContainer.scss";
import "@css/Toaster.scss";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StrictMode, type CSSProperties } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";

const queryClient = new QueryClient();

/**
 * Application router configuration
 *
 * @description !! IMPORTANT !! Routes object is imported from {@link ROUTES_CHILDREN}
 */
const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <Root contentType="error" />,
    children: ROUTES_CHILDREN,
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
  </StrictMode>,
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
  const { safeToDisplay } = useSessionChecker();

  const errorContent = contentType === "error";
  const renderContent = safeToDisplay ? "app" : "loading";

  const contentToRender: AppContent = errorContent
    ? contentType
    : renderContent;

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
      <SidebarDataProvider value={COMPLETE_SIDEBAR_DATAS}>
        <AppSidebar variant="inset" />
        <PageView className="main-app-container">
          <PageHeader />
          <PageTitle />
          <App>
            <AppContent render={contentToRender} />
          </App>
        </PageView>
      </SidebarDataProvider>
      <AppModals />
      <AppDrawers items={drawers} />
    </SidebarProvider>
  );
}

const PageView = SidebarInset;

function SpinnerPage() {
  return (
    <div className="inset-0 flex fixed justify-center items-center min-w-screen min-h-screen ">
      <Spinner
        role="status"
        aria-label="Loading"
        className="size-5 animate-spin"
      />
    </div>
  );
}
function AppContent({ render }: AppContentProps) {
  switch (render) {
    case "error":
      return <PageError />;
    case "loading":
      return <SpinnerPage />;
    default:
      return <Outlet context={COMPLETE_SIDEBAR_DATAS} />;
  }
}
