import {
  evaluationPageContentContainer,
  content,
  footer,
} from "@/assets/css/EvaluationPage.module.scss";

const hideSeparator = {
  className: "hidden",
};

export const TAB_CONTENT_VIEW_CARD_PROPS = {
  title: {
    displayChildrenOnly: true,
    separator: hideSeparator,
  },
  card: {
    className: evaluationPageContentContainer,
  },
  content: { className: content },
  footer: {
    className: footer,
    separator: hideSeparator,
  },
};
