import {
  contentRightSide,
  contentRightSideContainer,
  footer,
} from "@/assets/css/EvaluationPage.module.scss";

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
