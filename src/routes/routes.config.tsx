import { EvaluationPageTabsDatas } from "@/data/EvaluationPageDatas.tsx";
import { CompleteDatas } from "@/main.tsx";
import { About } from "@/pages/About/About.tsx";
import { PageError } from "@/pages/Error/PageError.tsx";
import { CreateEvaluations } from "@/pages/Evaluations/create/CreateEvaluations.tsx";
import { Evaluations } from "@/pages/Evaluations/Evaluations.tsx";
import { Home } from "@/pages/Home/Home.tsx";
import { Login } from "@/pages/Login/Login.tsx";
import { Navigate, type RouteObject } from "react-router-dom";
type NavMenu = (typeof CompleteDatas.navMain.menus)[number];

export type Loadertype<LDatas, PDatas> = {
  loaderData?: LDatas;
  pageTitle: string;
  pageDatas?: PDatas;
};

export type CreateEvaluationsLoaderData = Loadertype<
  NavMenu,
  typeof EvaluationPageTabsDatas
>;

/**
 * Application route children configuration.
 * Additional routes can be added here as needed.
 *
 * @description Each route object defines a path, element, and optional loader.
 * The loader functions set the document title and return necessary data for each route.
 *
 * @see {@link CompleteDatas} for sidebar and navigation data.
 * @see {@link EvaluationPageTabsDatas} for evaluation page tab data.
 * @see {@link setDocumentTitle} for setting the document title based on the route.
 *
 * Routes are used in the main application router configuration (see ./src/main.tsx).
 */
export const routeChildren = [
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
    path: "login",
    element: <Login />,
    loader: async () => {
      setDocumentTitle("Login");

      return { pageTitle: "hidden" };
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
] as RouteObject[];

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
