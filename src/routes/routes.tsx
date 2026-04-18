import { COMPLETE_SIDEBAR_DATAS } from "@/configs/main.configs";
import { EvaluationPageTabsDatas } from "@/data/EvaluationPageDatas.tsx";
import {
  inputSignupControllers,
  passwordCreationInputControllers,
} from "@/data/inputs-controllers.data.ts";
import { inputLoginControllers } from "@/features/auth/components/login/forms/login-inputs";
import { CreateEvaluations } from "@/features/evaluations/create/CreateEvaluations.tsx";
import { EvaluationEdit } from "@/features/evaluations/edit/EvaluationEdit";
import { EvaluationDetailDrawerRoute } from "@/features/evaluations/main/components/EvaluationDetailDrawer";
import { EvaluationsMain } from "@/features/evaluations/main/Evaluations";
import { EvaluationsView } from "@/features/evaluations/main/EvaluationsView";
import { About } from "@/pages/About/About.tsx";
import EmailValidation from "@/pages/Email/EmailValidation";
import { PageError } from "@/pages/Error/PageError.tsx";
import { Evaluations } from "@/pages/Evaluations/Evaluations.tsx";
import { Home } from "@/pages/Home/Home.tsx";
import { Login } from "@/pages/Login/Login.tsx";
import { PasswordCreation } from "@/pages/Password/PasswordCreation.tsx";
import { Signup } from "@/pages/Signup/Signup";
import {
  ALL_STEPS,
  EVALUATION_PAGE_TITLE,
} from "@/routes/config/routes.configs";
import { Navigate, type RouteObject } from "react-router-dom";

/**
 * Application route children configuration.
 * Additional routes can be added here as needed.
 *
 * @description Each route object defines a path, element, and optional loader.
 * The loader functions set the document title and return necessary data for each route.
 *
 * @see {@link COMPLETE_SIDEBAR_DATAS} for sidebar and navigation data.
 * @see {@link EvaluationPageTabsDatas} for evaluation page tab data.
 * @see {@link setDocumentTitle} for setting the document title based on the route.
 *
 * Routes are used in the main application router configuration (see ./src/main.tsx).
 */
export const ROUTES_CHILDREN: RouteObject[] = [
  {
    index: true,
    element: <Home />,
    loader: async () => {
      setDocumentTitle(COMPLETE_SIDEBAR_DATAS.sidebarHeader.tooltip);

      return {
        loaderData: COMPLETE_SIDEBAR_DATAS.sidebarHeader,
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
    children: [
      {
        index: true,
        element: <Signup inputControllers={inputSignupControllers} />,
        loader: async () => {
          setDocumentTitle("S'enregistrer");
          return { pageTitle: "hidden" };
        },
      },
      {
        path: "verify/:referral/:referralCode",
        element: <EmailValidation />,
        loader: async () => {
          setDocumentTitle("Vérification de l'inscription");
          return { pageTitle: "hidden" };
        },
      },
    ],
  },
  {
    path: "password-creation",
    element: (
      <PasswordCreation inputControllers={passwordCreationInputControllers} />
    ),
    loader: async () => {
      setDocumentTitle("Création du mot de passe");
      return { pageTitle: "hidden" };
    },
  },
  {
    path: "about",
    element: <About />,
  },
  {
    path: "evaluations",
    children: [
      {
        index: true,
        element: <Evaluations />,
        loader: async () => {
          const menu = COMPLETE_SIDEBAR_DATAS.navMain.menus[2];
          const { title: pageTitle } = menu;
          setDocumentTitle(pageTitle);

          return {
            pageTitle,
            loaderData: menu,
          };
        },
      },
      {
        path: ":evaluationId",
        element: <EvaluationsView />,
        loader: async () => {
          const title = COMPLETE_SIDEBAR_DATAS.navMain.menus[2].title;
          setDocumentTitle(title);
        },
      },
      {
        path: "TP",
        element: <EvaluationsMain />,
        loader: async () => {
          const pageTitle = COMPLETE_SIDEBAR_DATAS.navMain.menus[2].title;
          setDocumentTitle(pageTitle);

          return {
            pageTitle,
            // loaderData: COMPLETE_SIDEBAR_DATAS.navMain.menus[0],
            // pageDatas: EvaluationPageTabsDatas,
          };
        },
        children: [
          {
            path: "opened/:evaluationId",
            element: <EvaluationDetailDrawerRoute />,
            loader: async () => {
              const title = COMPLETE_SIDEBAR_DATAS.navMain.menus[2].title;
              setDocumentTitle(title);
            },
          },
        ],
      },
      {
        path: "Atelier",
        // element: <AtelierEvaluations />,
      },
      {
        path: "Techno",
        // element: <TechnoEvaluations />,
      },
      // The page is split into 2 zones :
      // - Left zone : Description or Subskills list
      // - Right zone : Evaluation and module selection
      {
        path: "create",
        element: <CreateEvaluations />,
        loader: async () => {
          const { title } = COMPLETE_SIDEBAR_DATAS.navMain.menus[0];
          setDocumentTitle(title);

          return {
            pageTitle: EVALUATION_PAGE_TITLE,
            loaderData: title,
            pageDatas: EvaluationPageTabsDatas,
          };
        },
        children: ALL_STEPS("create"),
      },

      {
        path: "edit/:evaluationId",
        element: <EvaluationEdit />,
        loader: async () => {
          const title = COMPLETE_SIDEBAR_DATAS.navMain.menus[4].title;
          setDocumentTitle(title);

          return {
            pageDatas: EvaluationPageTabsDatas,
          };
        },
        children: ALL_STEPS("edit"),
      },
    ],
  },
  {
    path: "logout",
    element: <Navigate to={"/"} />,
  },
  {
    path: "error",
    element: <PageError />,
  },
  {
    path: "*",
    element: <Navigate to={"/error"} />,
  },
];

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
