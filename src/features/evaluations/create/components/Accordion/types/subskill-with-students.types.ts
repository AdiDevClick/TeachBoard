import type { useStepFourState } from "@/features/evaluations/create/hooks/useStepFourState";
import type {
  ClassModuleSubSkill,
  ClassModules,
} from "@/features/evaluations/create/store/types/steps-creation-store.types";

type State = ReturnType<typeof useStepFourState>;

/**
 * @fileoverview This file defines the types for the SubSkillWithStudents component, which is responsible for displaying a subskill along with the students who have been evaluated for that subskill.
 */

/**
 * Props for the SubSkillWithStudents component, which displays a subskill and the students evaluated for it.
 */
export type SubSkillWithStudentsProps = Readonly<
  {
    module: ClassModules;
    storeGetter: State["getEvaluatedStudentsForSubSkill"];
    valueGetter: State["scoreValue"];
    index: number;
    color1?: string;
    color2?: string;
  } & ClassModuleSubSkill
>;
