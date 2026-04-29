import { EvaluationPageTabsDatas } from "@/data/EvaluationPageDatas";
import {
  LazyStepFour,
  LazyStepOne,
  LazyStepThree,
  LazyStepTwo,
} from "@/features/evaluations/create/steps/exports/steps.exports";

const DATE = new Date().toLocaleDateString();

export const EVALUATION_PAGE_TITLE = "Evaluation - " + DATE;

/**
 * Evaluation steps configuration for routing.
 *
 * This configuration defines the paths, components, and loaders for each step of the evaluation creation process.
 */
const EVALUATION_ELEMENTS = [
  { path: EvaluationPageTabsDatas.step1.name, element: <LazyStepOne /> },
  { path: EvaluationPageTabsDatas.step2.name, element: <LazyStepTwo /> },
  { path: EvaluationPageTabsDatas.step3.name, element: <LazyStepThree /> },
  {
    path: EvaluationPageTabsDatas.step4.name,
    element: <LazyStepFour />,
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
