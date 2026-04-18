import type { UUID } from "@/api/types/openapi/common.types";
import type { UseEvaluationsViewProps } from "@/features/evaluations/main/hooks/types/use-evaluations-view.types";

/**
 * Checks if a given evaluation contains a specific sub-skill for a given module.
 *
 * @param evaluation - The evaluation data for a student, including their scores and associated modules and sub-skills.
 * @param subskillId - The unique identifier of the sub-skill to check for within the evaluation.
 * @param moduleId - The unique identifier of the module to which the sub-skill belongs.
 */
export function evaluationContainsSubSkill(
  evaluation: NonNullable<
    UseEvaluationsViewProps["evaluationData"]
  >["evaluations"][number],
  subskillId: UUID,
  moduleId: UUID,
) {
  return evaluation.modules
    .find((evaluationModule) => evaluationModule.id === moduleId)
    ?.subSkills.some((subSkill) => subSkill.id === subskillId);
}
