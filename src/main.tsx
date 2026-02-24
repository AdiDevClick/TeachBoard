import { DialogProvider } from "@/api/providers/DialogProvider.tsx";
import { SidebarDataProvider } from "@/api/providers/SidebarDataProvider.tsx";
import { useAppStore } from "@/api/store/AppStore";
import App from "@/App.tsx";
import { PageHeader } from "@/components/Header/PageHeader";
import { AppSidebar } from "@/components/Sidebar/Sidebar.tsx";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar.tsx";
import { Toaster } from "@/components/ui/sonner";
import {
  DEV_MODE,
  doesContainNoSessionPage,
  NO_SESSION_CHECK_LOGS,
} from "@/configs/app.config.ts";
import { COMPLETE_SIDEBAR_DATAS } from "@/configs/main.configs";
import { useDialog } from "@/hooks/contexts/useDialog.ts";
import { useSessionChecker } from "@/hooks/database/sessions/useSessionChecker.ts";
import { AppModals } from "@/pages/AllModals/AppModals.tsx";
import { PageError } from "@/pages/Error/PageError.tsx";
import { ROUTES_CHILDREN } from "@/routes/routes.config";
import type { RootProps } from "@/types/MainTypes";
import "@css/MainContainer.scss";
import "@css/Toaster.scss";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  StrictMode,
  useEffect,
  useEffectEvent,
  type CSSProperties,
} from "react";
import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  Outlet,
  RouterProvider,
  useLocation,
} from "react-router-dom";

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
  const errorContent = contentType === "error";

  const lastUserActivity = useAppStore((state) => state.lastUserActivity);
  const sessionSynced = useAppStore((state) => state.sessionSynced);
  const { openDialog } = useDialog();
  const location = useLocation();
  const { data, isLoading, onSubmit, isLoaded, error } = useSessionChecker();

  const triggerSessionCheck = useEffectEvent(() => {
    onSubmit();
  });

  /**
   * Show login modal to user when no active session is found
   *
   * @description This is a gentle reminder for users to log in without redirecting them away from the current page, providing a smoother user experience.
   *
   * @remark !!! IMPORTANT !! Keep in mind that this approach assumes the users will interact with the login modal when it appears or they may continue exploring the site.
   *
   * @important Please, use the useSessionChecker hook in your critical components and ensure a check before fetching as the server will immediately return an error uppon invalid session, which will force trigger a redirection to the login page.
   */
  const showLoginModalToUser = useEffectEvent(() => {
    if (location.pathname === "/login") return;

    if (DEV_MODE) {
      console.debug(
        "No active session found. A dialog has been opened for login.",
      );
    }
    openDialog(null, "login");
  });

  /**
   * Automatically check session on app load unless the last user activity was a logout
   */
  useEffect(() => {
    const path = location.pathname;

    const isPublicPage = doesContainNoSessionPage(path);
    const lastActivityWasLogout = lastUserActivity === "logout";

    switch (true) {
      case lastActivityWasLogout && isPublicPage:
      case isPublicPage:
        if (DEV_MODE && !NO_SESSION_CHECK_LOGS) {
          console.debug(
            "Current page is public. No session check needed.",
            path,
          );
        }
        break;
      case sessionSynced:
        if (DEV_MODE && !NO_SESSION_CHECK_LOGS) {
          console.debug(
            "Session is already synced. No session check needed.",
            path,
          );
        }
        break;
      default:
        if (DEV_MODE && !NO_SESSION_CHECK_LOGS) {
          console.debug("Checking session on app load...", path);
        }
        triggerSessionCheck();
    }
  }, [isLoaded, lastUserActivity, sessionSynced, location.pathname]);

  useEffect(() => {
    if (isLoading) {
      if (DEV_MODE && !NO_SESSION_CHECK_LOGS) {
        console.debug("Session Check Loading...");
      }
    }

    if (data) {
      if (DEV_MODE && !NO_SESSION_CHECK_LOGS) {
        console.debug("Session Check Data:", data);
      }
    }

    if (error && !isLoading) {
      showLoginModalToUser();

      if (DEV_MODE && !NO_SESSION_CHECK_LOGS) {
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
      <SidebarDataProvider value={COMPLETE_SIDEBAR_DATAS}>
        <AppSidebar variant="inset" />
        <SidebarInset className="main-app-container">
          <PageHeader />
          <App>
            {errorContent ? (
              <PageError />
            ) : (
              <Outlet context={COMPLETE_SIDEBAR_DATAS} />
            )}
          </App>
        </SidebarInset>
      </SidebarDataProvider>
      <AppModals />
    </SidebarProvider>
  );
}
