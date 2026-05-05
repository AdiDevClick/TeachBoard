import type { useStepFourState } from "@/features/evaluations/create/hooks/useStepFourState";
import type { StepFourInputControllers } from "@/features/evaluations/create/steps/four/controller/types/step-four-controller.types";

type Controller = StepFourInputControllers["modules"];

type State = ReturnType<typeof useStepFourState>;

/**
 * Props for the LabelledAccordion component.
 */
export type LabelledAccordionProps = Readonly<{
  inputController: Controller;
  accordionItems: State["modules"];
  storeGetter: State["getEvaluatedStudentsForSubSkill"];
  valueGetter: State["scoreValue"];
}>;
