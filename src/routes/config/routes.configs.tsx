import { EvaluationPageTabsDatas } from "@/data/EvaluationPageDatas";
import { StepFour } from "@/features/evaluations/create/steps/four/StepFour";
import { StepOne } from "@/features/evaluations/create/steps/one/StepOne";
import { StepThree } from "@/features/evaluations/create/steps/three/StepThree";
import { StepTwo } from "@/features/evaluations/create/steps/two/StepTwo";

const DATE = new Date().toLocaleDateString();

export const EVALUATION_PAGE_TITLE = "Evaluation - " + DATE;

/**
 * Evaluation steps configuration for routing.
 *
 * This configuration defines the paths, components, and loaders for each step of the evaluation creation process.
 */
const EVALUATION_ELEMENTS = [
  { path: EvaluationPageTabsDatas.step1.name, element: <StepOne /> },
  { path: EvaluationPageTabsDatas.step2.name, element: <StepTwo /> },
  { path: EvaluationPageTabsDatas.step3.name, element: <StepThree /> },
  {
    path: EvaluationPageTabsDatas.step4.name,
    element: <StepFour />,
    title: "hidden",
  },
];

/**
 * Generates the route configuration for all evaluation steps based on the provided mode.
 *
 * @param mode - The mode of the evaluation process (e.g., "create", "edit").
 */
export const ALL_STEPS = (mode: string) =>
  EVALUATION_ELEMENTS.map((elem) => ({
    path: elem.path,
    element: elem.element,
    loader: async () => ({
      pageTitle: elem.title ?? EVALUATION_PAGE_TITLE,
      mode,
    }),
  }));
