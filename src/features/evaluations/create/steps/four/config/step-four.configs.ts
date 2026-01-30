// Summary
export const STEP_FOUR_CARD_PROPS = {
  card: { className: "content__right" },
  title: {
    title: "Récapitulatif de l'évaluation",
    description: new Date().toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }),
  },
  content: {
    className: "right__content-container",
  },
};
