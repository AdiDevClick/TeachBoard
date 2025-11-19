import { EvaluationPageTabsDatas } from "@/data/EvaluationPageDatas.tsx";
import {
  inputLoginControllers,
  inputSignupControllers,
} from "@/data/inputs-controllers.data.ts";
import { completeDatas } from "@/main.tsx";
import { About } from "@/pages/About/About.tsx";
import { PageError } from "@/pages/Error/PageError.tsx";
import { CreateEvaluations } from "@/pages/Evaluations/create/CreateEvaluations.tsx";
import { StepOne } from "@/pages/Evaluations/create/steps/StepOne.tsx";
import { Evaluations } from "@/pages/Evaluations/Evaluations.tsx";
import { Home } from "@/pages/Home/Home.tsx";
import { Login } from "@/pages/Login/Login.tsx";
import { Signup } from "@/pages/Signup/Signup";
import { Navigate, type RouteObject } from "react-router-dom";
type NavMenu = (typeof completeDatas.navMain.menus)[number];

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
 * @see {@link completeDatas} for sidebar and navigation data.
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
      setDocumentTitle(completeDatas.sidebarHeader.tooltip);

      return {
        loaderData: completeDatas.sidebarHeader,
        pageTitle: "Dashboard",
      };
    },
  },
  {
    path: "login",
    element: <Login inputControllers={inputLoginControllers} />,
    loader: async () => {
      setDocumentTitle("Login");

      return { pageTitle: "hidden" };
    },
  },
  {
    path: "signup",
    element: <Signup inputControllers={inputSignupControllers} />,
    loader: async () => {
      setDocumentTitle("S'enregistrer");
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
      setDocumentTitle(completeDatas.navMain.menus[2].title);

      return {
        pageTitle: completeDatas.navMain.menus[2].title,
        loaderData: completeDatas.navMain.menus[2],
      };
    },
    children: [
      {
        path: "create",
        element: <CreateEvaluations />,
        loader: async () => {
          const date = new Date().toLocaleDateString();
          setDocumentTitle(completeDatas.navMain.menus[0].title);

          return {
            pageTitle: "Evaluation - " + date,
            loaderData: completeDatas.navMain.menus[0],
            pageDatas: EvaluationPageTabsDatas,
          };
        },
        children: [
          {
            path: EvaluationPageTabsDatas.step1.name,
            element: (
              <StepOne
                title={EvaluationPageTabsDatas.step1.rightSide.title}
                placeholder={EvaluationPageTabsDatas.step1.rightSide.subTitle}
              />
            ),
            loader: async () => {
              const date = new Date().toLocaleDateString();
              // setDocumentTitle(EvaluationPageTabsDatas.step1.name);
              return {
                pageTitle: "Evaluation - " + date,
              };
            },
          },
          {
            path: EvaluationPageTabsDatas.step2.name,
            element: <StepOne title="bots" placeholder="bots" />,
            loader: async () => {
              const date = new Date().toLocaleDateString();
              // setDocumentTitle(EvaluationPageTabsDatas.step2.name);
              return {
                pageTitle: "Evaluation - " + date,
              };
            },
          },
          {
            path: EvaluationPageTabsDatas.step3.name,
            element: <StepOne title="dsq" placeholder="dsq" />,
            loader: async () => {
              const date = new Date().toLocaleDateString();
              // setDocumentTitle(EvaluationPageTabsDatas.step3.name);
              return {
                pageTitle: "Evaluation - " + date,
              };
            },
          },
          {
            path: EvaluationPageTabsDatas.step4.name,
            element: <StepOne title="gfgg" placeholder="gfgg" />,
            loader: async () => {
              const date = new Date().toLocaleDateString();
              // setDocumentTitle(EvaluationPageTabsDatas.step4.name);
              return {
                pageTitle: "Evaluation - " + date,
              };
            },
          },
        ],
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
