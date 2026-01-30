import withTitledCard from "@/components/HOCs/withTitledCard.tsx";
import { StepThreeModuleSelectionController } from "@/pages/Evaluations/create/steps/three/controllers/StepThreeModuleSelectionController.tsx";
import { StepThreeStudentsEvaluationController } from "@/pages/Evaluations/create/steps/three/controllers/StepThreeStudentsEvaluationController.tsx";
import type { ComponentProps } from "react";

/**
 * Convenient function to show module selection component
 */
export function ShowModuleSelection(
  commonProps: ComponentProps<typeof ModuleSelection>,
) {
  return (
    <ModuleSelection {...commonProps}>
      <ModuleSelection.Title />
      <ModuleSelection.Content />
    </ModuleSelection>
  );
}

/**
 * Convenient function to show students evaluation component
 */
export function ShowStudentsEvaluation(
  commonProps: ComponentProps<typeof StudentsEvaluation>,
) {
  return (
    <StudentsEvaluation {...commonProps}>
      <StudentsEvaluation.Title />
      <StudentsEvaluation.Content />
    </StudentsEvaluation>
  );
}

const ModuleSelection = withTitledCard(StepThreeModuleSelectionController);
const StudentsEvaluation = withTitledCard(
  StepThreeStudentsEvaluationController,
);
