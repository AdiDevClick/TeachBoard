import { summaryPageContent } from "@/assets/css/SummaryPage.module.scss";
import type { StepFourInputItem } from "@/features/evaluations/create/steps/four/models/step-four.models";

export const STEP_FOUR_COMMENTS_INPUT_CONTROLLERS = {
  name: "comments",
  title: "Commentaires",
  type: "text",
  placeholder: "Notes sur la classe...",
  required: false,
} satisfies StepFourInputItem;

export const STEP_FOUR_ABSENCE_INPUT_CONTROLLERS = {
  name: "absence",
  title: "Elèves absents aujourd'hui",
  type: "button",
  inert: true,
} satisfies StepFourInputItem;

export const STEP_FOUR_SCORES_AVERAGES_INPUT_CONTROLLERS = {
  name: "scoresAverage",
  title: "Note globale des élèves",
  placeholder: "Aucun élève évalué",
  description: "Moyenne générale des notes pour chaque élève évalué(e)",
  required: true,
} satisfies StepFourInputItem;

export const STEP_FOUR_MODULES_INPUT_CONTROLLERS = {
  name: "modules",
  title: "Les modules",
  type: "single",
  className: summaryPageContent,
  collapsible: true,
  color1: "bg-blue-50",
  color2: "bg-green-50/50",
  placeholder: "Aucun module évalué",
} satisfies StepFourInputItem;
