import type { StudentEvaluationModuleType } from "@/features/evaluations/create/store/types/steps-creation-store.types";

/**
 * For the calculateStudentOverallScore() function
 */
export type StudentEvaluationModuleLike =
  | StudentEvaluationModuleType
  | {
      subSkills: readonly { score: number }[];
    };
