import {
  contentRightSide,
  contentRightSideContainer,
} from "@/assets/css/EvaluationPage.module.scss";

/**
 * Configuration for Step Two of the evaluation creation process.
 */
export const STEP_TWO_CARD_PROPS = {
  card: { className: contentRightSide },
  title: {
    title: "Liste d'élèves",
    description: "Définir les élèves présents ainsi que leurs fonctions.",
  },
  content: {
    className: contentRightSideContainer,
  },
};
