import type {
  ControlledCriteriaInput,
  ControlledTextArea,
  DynamicCriteriaList,
} from "@/features/class-creation/components/DegreeModuleSkill/exports/degree-module-skill-justification.exports";
import { DEGREE_MODULE_SKILL_REQUIRED_SCORES } from "@/features/class-creation/components/DegreeModuleSkill/models/degree-module-skill.model";

export const degreeSubSkillsCreationCriterionScoreInputControllers = {
  name: "score",
  title: "Justification",
  step: 25,
  min: 0,
  max: 100,
  scoreSteps: DEGREE_MODULE_SKILL_REQUIRED_SCORES,
  removeButtonLabel: "Supprimer la justification",
} satisfies Readonly<typeof ControlledCriteriaInput>;

export const degreeSubSkillsCreationCriterionInputControllers = {
  name: "criterion",
  title: "Critère pour la note",
  placeholder:
    "Ex: Une note de 0 est requise si l'élève n'a aucune connaissance de la compétence",
} satisfies Readonly<typeof ControlledTextArea>;

export const dynamicCriterionListController = {
  name: "criteria" as const,
  title: "Critères par palier de score",
  description: "Ajoutez plusieurs critères pour chaque palier.",
  minItems: 1,
  maxItems: 5,
  addButtonLabel: "Ajouter un critère",
  initialItem: { score: 0, criterion: "" },
} satisfies Readonly<typeof DynamicCriteriaList>;
