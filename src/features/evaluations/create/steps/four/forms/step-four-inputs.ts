import { summaryPageContent } from "@/assets/css/SummaryPage.module.scss";
import type { StepFour } from "@/features/evaluations/create/steps/four/StepFour";

export const STEP_FOUR_OBSERVATIONS_INPUT_CONTROLLERS = [
  {
    name: "observations",
    title: "Observations",
    type: "text",
    placeholder: "Notes sur la classe...",
    required: false,
  },
] satisfies Parameters<typeof StepFour>[0]["inputControllers"];

export const STEP_FOUR_ABSENCE_INPUT_CONTROLLERS = [
  {
    name: "absence",
    title: "Elèves absents aujourd'hui",
    type: "button",
    placeholder: "Aucun",
    required: true,
  },
] satisfies Parameters<typeof StepFour>[0]["inputControllers"];

export const STEP_FOUR_SCORES_AVERAGES_INPUT_CONTROLLERS = [
  {
    name: "scoresAverage",
    title: "Note globale des élèves",
    type: "number",
    description: "Moyenne générale des notes pour chaque élève évalué(e)",
    required: true,
  },
] satisfies Parameters<typeof StepFour>[0]["inputControllers"];

export const STEP_FOUR_MODULES_INPUT_CONTROLLERS = [
  {
    name: "modules",
    title: "Les modules",
    type: "single",
    className: summaryPageContent,
    collapsible: true,
    description: "Moyenne générale des notes pour chaque élève évalué(e)",
    required: true,
  },
] satisfies Parameters<typeof StepFour>[0]["inputControllers"];
