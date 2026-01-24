import { EvaluationRadioItemList } from "@/components/Radio/EvaluationRadioItem.tsx";
import { RadioGroup } from "@/components/ui/radio-group.tsx";
import {
  debugLogs,
  stepThreeModuleSelectionControllerPropsInvalid,
} from "@/configs/app-components.config.ts";
import { useStepThreeHandler } from "@/hooks/useStepThreeHandler.ts";
import type { StepThreeModuleSelectionControllerProps } from "@/pages/Evaluations/create/steps/three/types/step-three.types.ts";

/**
 * Step Three Module Selection Controller.
 *
 * @remarks The logic for handling module selection is encapsulated in the useStepThreeHandler hook.
 *
 * @param modules - List of modules available for selection
 * @param formId - The ID of the form
 */
export function StepThreeModuleSelectionController(
  props: StepThreeModuleSelectionControllerProps,
) {
  const { formId, modules } = props;
  const {
    handleModuleChangeCallback,
    handleSameModuleSelectionClickCallback,
    selectedModuleId,
  } = useStepThreeHandler(modules);

  if (stepThreeModuleSelectionControllerPropsInvalid(props)) {
    debugLogs("StepThreeModuleSelectionController", props);
    return null;
  }

  return (
    <form id={formId}>
      <RadioGroup
        value={selectedModuleId ?? ""}
        onValueChange={handleModuleChangeCallback}
      >
        <EvaluationRadioItemList
          items={modules}
          itemClick={handleSameModuleSelectionClickCallback}
        />
      </RadioGroup>
    </form>
  );
}
