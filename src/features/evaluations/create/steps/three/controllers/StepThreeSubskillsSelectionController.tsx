import { EvaluationRadioItemWithoutDescriptionList } from "@/components/Radio/EvaluationRadioItem.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import { RadioGroup } from "@/components/ui/radio-group.tsx";
import {
  debugLogs,
  stepThreeSubskillsSelectionControllerPropsInvalid,
} from "@/configs/app-components.config.ts";
import { useStepThreeState } from "@/features/evaluations/create/hooks/useStepThreeState";
import { useSubSkillsSelection } from "@/features/evaluations/create/steps/three/hooks/useSubSkillsSelection";
import type { StepThreeSubskillsSelectionControllerProps } from "@/features/evaluations/create/steps/three/types/step-three.types.ts";
import { animation } from "@/utils/utils";
import { Activity, type ComponentProps } from "react";

/**
 * Step Three Subskills Selection Controller.
 *
 * @remarks The logic for handling sub-skill selection is managed via the useEvaluationStepsCreationStore hook.
 *
 * @param formId - The ID of the form
 */
export function StepThreeSubskillsSelectionController(
  props: StepThreeSubskillsSelectionControllerProps,
) {
  const subSkills = useStepThreeState().subSkills;
  const { handleSubSkillChangeCallback, selectedSubSkillId } =
    useSubSkillsSelection(subSkills);
  const selectedId = selectedSubSkillId ?? subSkills[0]?.id ?? null;

  if (stepThreeSubskillsSelectionControllerPropsInvalid(props)) {
    debugLogs("StepThreeSubskillsSelectionController", props);
    return null;
  }

  const { isActive, dir = "ltr", defaultValue, ...rest } = props;

  return (
    <>
      <Activity
        mode={subSkills.length === 0 && isActive ? "visible" : "hidden"}
      >
        <Badge variant="outline" className="p-4">
          Aucune sous-compétence disponible pour ce module.
        </Badge>
      </Activity>
      <Activity mode={subSkills.length > 0 ? "visible" : "hidden"}>
        <RadioGroup
          id={"step-three-subskills-selection"}
          value={selectedId}
          onValueChange={handleSubSkillChangeCallback}
          dir={dir as ComponentProps<typeof RadioGroup>["dir"]}
          {...animation(isActive, {
            incoming: {
              name: "step-three-evaluation-in",
              delay: "200",
            },
            outgoing: { name: "step-three-evaluation-out" },
          })}
          {...rest}
        >
          <EvaluationRadioItemWithoutDescriptionList items={subSkills} />
        </RadioGroup>
      </Activity>
    </>
  );
}
