import { SidebarDataProvider } from "@/api/providers/SidebarDataProvider.tsx";
import App from "@/App.tsx";
import { AppSidebar } from "@/components/Sidebar/Sidebar.tsx";
import { SiteHeader } from "@/components/site-header.tsx";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar.tsx";
import { calendarEvents } from "@/data/CalendarData.ts";
import { EvaluationPageTabsDatas } from "@/data/EvaluationPageDatas.tsx";
import { sidebarDatas } from "@/data/SidebarData";
import { About } from "@/pages/About/About.tsx";
import { PageError } from "@/pages/Error/PageError.tsx";
import { CreateEvaluations } from "@/pages/Evaluations/create/CreateEvaluations";
import { Evaluations } from "@/pages/Evaluations/Evaluations.tsx";
import { Home } from "@/pages/Home/Home.tsx";
import type { RootProps } from "@/types/MainTypes.ts";
import "@css/MainContainer.scss";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StrictMode, type CSSProperties } from "react";
import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  Navigate,
  Outlet,
  RouterProvider,
} from "react-router-dom";

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

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <Root contentType="error" />,
    children: [
      {
        index: true,
        element: <Home />,
        loader: async () => {
          setDocumentTitle(CompleteDatas.sidebarHeader.tooltip);

          return {
            loaderData: CompleteDatas.sidebarHeader,
            pageTitle: "Dashboard",
          };
        },
      },
      {
        path: "about",
        element: <About />,
      },
      {
        path: "evaluations",
        element: <Evaluations />,
        loader: async () => {
          setDocumentTitle(CompleteDatas.navMain.menus[2].title);

          return {
            pageTitle: CompleteDatas.navMain.menus[2].title,
            loaderData: CompleteDatas.navMain.menus[2],
          };
        },
        children: [
          {
            path: "create",
            element: <CreateEvaluations />,
            loader: async () => {
              const date = new Date().toLocaleDateString();
              setDocumentTitle(CompleteDatas.navMain.menus[0].title);

              return {
                pageTitle: "Evaluation - " + date,
                loaderData: CompleteDatas.navMain.menus[0],
                pageDatas: EvaluationPageTabsDatas,
              };
            },

            // let done = false;

            // CompleteDatas.navMain.menus.map((element) => {
            //   if (done) return;
            //   const location = window.location.pathname;
            //   element.isActive = "/" + element.url === location;

            //   if (element.isActive) {
            //     document.title = "TeachBoard - " + element.title;
            //     done = true;
            //   }
            // });
          },
        ],
      },
      {
        path: "error",
        element: <PageError />,
      },
      {
        path: "*",
        element: <Navigate to={"/error"} />,
      },
    ],
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
export function Root({ contentType }: RootProps) {
  const errorContent = contentType === "error";

  return (
    <>
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
            <SiteHeader />
            <App>
              {errorContent ? <PageError /> : <Outlet context={null} />}
            </App>
          </SidebarInset>
        </SidebarDataProvider>
      </SidebarProvider>
    </>
  );
}

/**
 * Set the document title based on the selected menu item
 *
 * @param menu - The menu item to set the title for
 */
function setDocumentTitle(menu: string) {
  const oldTitle = document.title;

  if (menu) {
    document.title = "TeachBoard - " + menu;
  } else {
    document.title = oldTitle;
  }
}
