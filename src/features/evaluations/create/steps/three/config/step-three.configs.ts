import {
  contentRightSide,
  contentRightSideContainer,
  arrowBack,
} from "@/assets/css/EvaluationPage.module.scss";

// Module selection
export const STEP_THREE_MODULE_SELECTION_CARD_PROPS = {
  card: { className: contentRightSide },
  title: {
    title: "Liste des catégories",
    description: "Par quoi doit-on commencer ?",
  },
  content: {
    className: contentRightSideContainer,
  },
};

// Subskills selection
export const STEP_THREE_SUBSKILLS_SELECTION_TITLE_PROPS = {
  title: "Notation des élèves",
  description: "Quelles sous-compétences évaluer ?",
};

export const STEP_THREE_SUBSKILLS_SELECTION_CARD_PROPS = {
  arrowBack: { className: arrowBack },
  card: { className: contentRightSide },
  title: STEP_THREE_SUBSKILLS_SELECTION_TITLE_PROPS,
  content: {
    className: contentRightSideContainer,
  },
};
