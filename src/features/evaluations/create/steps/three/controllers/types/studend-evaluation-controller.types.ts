import type { UUID } from "@/api/types/openapi/common.types";
import type {
  ClassModuleSubSkill,
  ClassModules,
} from "@/features/evaluations/create/store/types/steps-creation-store.types";

/**
 * @fileoverview Types for the StepThreeStudentsEvaluationController component
 */

/**
 * Type definition for the state of a student's evaluation in Step Three
 */
export type StudentEvaluationState = {
  studentId: UUID | null;
  subSkill: ClassModuleSubSkill | null;
  score: number | null;
  module: ClassModules | null;
};
