import {
  contentRightSide,
  contentRightSideContainer,
  footer,
} from "@/assets/css/EvaluationPage.module.scss";
import {
  STEP_FOUR_ABSENCE_INPUT_CONTROLLERS,
  STEP_FOUR_COMMENTS_INPUT_CONTROLLERS,
  STEP_FOUR_MODULES_INPUT_CONTROLLERS,
  STEP_FOUR_SCORES_AVERAGES_INPUT_CONTROLLERS,
} from "@/features/evaluations/create/steps/four/forms/step-four-inputs";

// Summary
export const STEP_FOUR_CARD_PROPS = {
  card: { className: contentRightSide },
  title: {
    title: "Récapitulatif de l'évaluation",
    description: new Date().toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }),
  },
  content: {
    className: contentRightSideContainer,
  },
  footer: { className: footer },
};

export const STEP_FOUR_INPUT_CONTROLLERS = {
  comments: STEP_FOUR_COMMENTS_INPUT_CONTROLLERS,
  absence: STEP_FOUR_ABSENCE_INPUT_CONTROLLERS,
  scoresAverage: STEP_FOUR_SCORES_AVERAGES_INPUT_CONTROLLERS,
  modules: STEP_FOUR_MODULES_INPUT_CONTROLLERS,
};
