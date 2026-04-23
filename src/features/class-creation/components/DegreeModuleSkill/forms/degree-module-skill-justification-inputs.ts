import type {
  ControlledCriteriaInput,
  ControlledTextArea,
  DynamicCriteriaList,
} from "@/features/class-creation/components/DegreeModuleSkill/exports/degree-module-skill-justification.exports";
import { DEGREE_MODULE_SKILL_REQUIRED_SCORES } from "@/features/class-creation/components/DegreeModuleSkill/models/degree-module-skill.model";

export const degreeSubSkillsCreationCriteriasScoreInputControllers = {
  name: "score",
  title: "Justification",
  defaultValue: 0,
  step: 25,
  min: 0,
  max: 100,
  scoreSteps: DEGREE_MODULE_SKILL_REQUIRED_SCORES,
  removeButtonLabel: "Supprimer la justification",
} satisfies Readonly<typeof ControlledCriteriaInput>;

export const degreeSubSkillsCreationCriteriasDescriptionInputControllers = {
  name: "description",
  title: "Critère pour la note",
  placeholder:
    "Ex: Une note de 0 est requise si l'élève n'a aucune connaissance de la compétence",
} satisfies Readonly<typeof ControlledTextArea>;

export const dynamicCriteriasListController = {
  name: "criterias" as const,
  title: "Critères par palier de score",
  description: "Ajoutez plusieurs critères pour chaque palier.",
  minItems: 1,
  maxItems: 5,
  addButtonLabel: "Ajouter un critère",
  initialItem: { score: 0, description: "" },
} satisfies Readonly<typeof DynamicCriteriaList>;
