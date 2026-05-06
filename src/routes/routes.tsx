import { COMPLETE_SIDEBAR_DATAS } from "@/configs/main.configs";
import { EvaluationPageTabsDatas } from "@/data/EvaluationPageDatas.tsx";
import {
  inputSignupControllers,
  passwordCreationInputControllers,
} from "@/data/inputs-controllers.data.ts";
import { inputLoginControllers } from "@/features/auth/components/login/forms/login-inputs";
import { LazyGoogleOAuth } from "@/features/auth/components/oauth/google/exports/oauth.exports";
import { LazyCreateEvaluations } from "@/features/evaluations/create/exports/create-evaluations.exports";
import { LazyEvaluationDelete } from "@/features/evaluations/delete/exports/evaluation-delete.exports";
import { LazyEvaluationEdit } from "@/features/evaluations/edit/exports/evaluation-edit.exports";
import { LazyEvaluationsList } from "@/features/evaluations/main/exports/evaluation-list.exports";
import {
  LazyEvaluationDetailDrawerRoute,
  LazyEvaluationsView,
} from "@/features/evaluations/main/exports/evaluation-view.exports";
import { LazyAbout } from "@/pages/About/exports/about.exports";
import { LazyEmailValidation } from "@/pages/Email/exports/email-validation.exports";
import { PageError } from "@/pages/Error/PageError.tsx";
import { Home } from "@/pages/Home/Home.tsx";
import { LazyLogin } from "@/pages/Login/exports/login.exports";
import { LazyPasswordCreation } from "@/pages/Password/exports/password-creation.exports";
import { LazySignup } from "@/pages/Signup/exports/signup.exports";
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
    path: "auth",
    children: [
      {
        path: "google-callback",
        element: <LazyGoogleOAuth />,
      },
    ],
  },
  {
    path: "login",
    element: <LazyLogin inputControllers={inputLoginControllers} />,
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
        element: <LazySignup inputControllers={inputSignupControllers} />,
        loader: async () => {
          setDocumentTitle("S'enregistrer");
          return { pageTitle: "hidden" };
        },
      },
      {
        path: "verify/:referral/:referralCode",
        element: <LazyEmailValidation />,
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
      <LazyPasswordCreation
        inputControllers={passwordCreationInputControllers}
      />
    ),
    loader: async () => {
      setDocumentTitle("Création du mot de passe");
      return { pageTitle: "hidden" };
    },
  },
  {
    path: "about",
    element: <LazyAbout />,
  },
  {
    path: "evaluations",
    children: [
      // {
      //   index: true,
      //   element: <Evaluations />,
      //   loader: async () => {
      //     const menu = COMPLETE_SIDEBAR_DATAS.navMain.menus[2];
      //     const { title: pageTitle } = menu;
      //     setDocumentTitle(pageTitle);

      //     return {
      //       pageTitle,
      //       loaderData: menu,
      //     };
      //   },
      // },
      {
        path: ":evaluationId",
        element: <LazyEvaluationsView />,
        loader: async () => {
          const title = COMPLETE_SIDEBAR_DATAS.navMain.menus[2].title;
          setDocumentTitle(title);
        },
      },
      {
        path: "TP",
        element: <LazyEvaluationsList />,
        loader: async () => {
          const pageTitle = COMPLETE_SIDEBAR_DATAS.navMain.menus[2].title;
          setDocumentTitle(pageTitle);

          return { pageTitle };
        },
        children: [
          {
            path: "opened/:evaluationId",
            element: <LazyEvaluationDetailDrawerRoute />,
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
        element: <LazyCreateEvaluations />,
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
        element: <LazyEvaluationEdit />,
        loader: async () => {
          const title = COMPLETE_SIDEBAR_DATAS.navMain.menus[4].title;
          setDocumentTitle(title);

          return { pageDatas: EvaluationPageTabsDatas };
        },
        children: ALL_STEPS("edit"),
      },
      {
        path: "delete/:evaluationId",
        element: <LazyEvaluationDelete />,
        loader: async () => {
          const title = COMPLETE_SIDEBAR_DATAS.navMain.menus[4].title;
          setDocumentTitle(title);

          return { pageTitle: "hidden" };
        },
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
