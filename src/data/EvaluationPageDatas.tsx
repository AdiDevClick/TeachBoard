import { StepOne } from "@/pages/Evaluations/create/steps/StepOne.tsx";

export const EvaluationPageTabsDatas = {
  step1: {
    tabTitle: "Classe",
    leftSide: {
      number: 1,
      title: "Classe à évaluer",
      description: "Choisir la classe d’élèves qui participent à l'évaluation.",
    },
    rightSide: {
      // title: "Les classes disponibles",
      // subTitle: "Choisir...",
      content: () => {
        const title = "Les classes disponibles";
        const placeholder = "Choisir...";

        return <StepOne title={title} placeholder={placeholder} />;
      },
    },
  },
  step2: {
    tabTitle: "Elèves",
    leftSide: {
      number: 2,
      title: "Elèves présents",
      description:
        "Renseignez les élèves qui participent à l'évaluation ainsi que leur fonctions du jour",
    },
    rightSide: {
      title: "Liste d'élèves",
      subTitle: "Définir les élèves présents et leurs fonctions.",
    },
  },
  step3: {
    tabTitle: "Evaluation",
    leftSide: {
      number: 3,
      title: "Evaluation des élèves",
      description:
        "Déterminer les compétences techniques ou transversales des élèves.",
    },
    rightSide: {
      title: "Liste des catégories",
      subTitle: "Par quoi doit-on commencer ?",
    },
  },
  step4: {
    tabTitle: "Archiver",
    leftSide: {
      number: 4,
      title: "Archiver l'évaluation du jour",
      description: "Récapitulatif de la session et archivage de l'évaluation.",
    },
    rightSide: {
      title: "Récapitulatif de l'évaluation",
      subTitle: new Date().toLocaleDateString(),
    },
  },
};
