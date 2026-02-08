import { EvaluationPageTabsDatas } from "@/data/EvaluationPageDatas.tsx";
import {
  inputSignupControllers,
  passwordCreationInputControllers,
} from "@/data/inputs-controllers.data.ts";
import { inputLoginControllers } from "@/features/auth/components/login/forms/login-inputs";
import { CreateEvaluations } from "@/features/evaluations/create/CreateEvaluations.tsx";
import { StepFour } from "@/features/evaluations/create/steps/four/StepFour.tsx";
import { StepOne } from "@/features/evaluations/create/steps/one/StepOne";
import { StepThree } from "@/features/evaluations/create/steps/three/StepThree.tsx";
import { StepTwo } from "@/features/evaluations/create/steps/two/StepTwo.tsx";
import { completeDatas } from "@/main.tsx";
import { About } from "@/pages/About/About.tsx";
import EmailValidation from "@/pages/Email/EmailValidation";
import { PageError } from "@/pages/Error/PageError.tsx";
import { Evaluations } from "@/pages/Evaluations/Evaluations.tsx";
import { Home } from "@/pages/Home/Home.tsx";
import { Login } from "@/pages/Login/Login.tsx";
import { PasswordCreation } from "@/pages/Password/PasswordCreation.tsx";
import { Signup } from "@/pages/Signup/Signup";
import { Navigate, type RouteObject } from "react-router-dom";

const DATE = new Date().toLocaleDateString();
const EVALUATION_PAGE_TITLE = "Evaluation - " + DATE;

const EVALUATION_ELEMENTS = [
  { path: EvaluationPageTabsDatas.step1.name, element: <StepOne /> },
  { path: EvaluationPageTabsDatas.step2.name, element: <StepTwo /> },
  { path: EvaluationPageTabsDatas.step3.name, element: <StepThree /> },
  { path: EvaluationPageTabsDatas.step4.name, element: <StepFour /> },
] as const;

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
export const ROUTES_CHILDREN = [
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
          setDocumentTitle(completeDatas.navMain.menus[2].title);

          return {
            pageTitle: completeDatas.navMain.menus[2].title,
            loaderData: completeDatas.navMain.menus[2],
          };
        },
      },
      // The page is split into 2 zones :
      // - Left zone : Description or Subskills list
      // - Right zone : Evaluation and module selection
      {
        path: "create",
        element: <CreateEvaluations />,
        loader: async () => {
          setDocumentTitle(completeDatas.navMain.menus[0].title);

          return {
            pageTitle: EVALUATION_PAGE_TITLE,
            loaderData: completeDatas.navMain.menus[0],
            pageDatas: EvaluationPageTabsDatas,
          };
        },
        children: EVALUATION_ELEMENTS.map((elem) => ({
          path: elem.path,
          element: elem.element,
          loader: async () => ({
            pageTitle: EVALUATION_PAGE_TITLE,
          }),
        })),
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
