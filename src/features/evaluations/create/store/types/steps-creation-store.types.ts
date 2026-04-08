import type { UUID } from "@/api/types/openapi/common.types.ts";
import type { ClassSummaryDto } from "@/api/types/routes/classes.types.ts";
import type {
  SkillsType,
  SkillsViewDto,
} from "@/api/types/routes/skills.types.ts";
import type { DetailedEvaluationView } from "@/features/evaluations/main/models/evaluations-view.models";
import type { UniqueSet } from "@/utils/UniqueSet.ts";

export type StudentEvaluationSubSkillType = { score: number } & SkillsType;

export type StudentEvaluationModuleType = {
  subSkills: UniqueSet<UUID, StudentEvaluationSubSkillType>;
} & SkillsType;

/**
 * Student with presence information for Steps Creation.
 */
export type StudentWithPresence = {
  id: UUID;
  fullName: string;
  overallScore?: number | null;
  isPresent: boolean;
  assignedTask?: Pick<ClassTasks, "id" | "name"> | null;
  evaluations?: {
    modules: UniqueSet<UUID, StudentEvaluationModuleType>;
  } | null;
};

/**
 * Class tasks structure for Steps Creation.
 */
export type ClassTasks = {
  id: UUID;
  name: string | null;
  modules: UniqueSet<UUID, SkillsViewDto>;
};

type ClassModuleSubSkillBase = SkillsType & {
  isCompleted?: boolean;
  isDisabled?: boolean;
};

export type ClassModuleSubSkill = ClassModuleSubSkillBase & {
  isLinkedToTasks?: Set<ClassTasks["id"]>;
};

export type ClassModules = ClassModuleSubSkillBase & {
  subSkills: UniqueSet<UUID, ClassModuleSubSkill>;
  tasksList: Set<ClassTasks["id"]>;
  /** optional - Can be created by the object reshape */
  value?: string;
  studentsToEvaluate?: Set<UUID>;
};

export type ModulesSelectionType = {
  isClicked: boolean;
  selectedModuleIndex: number | null;
  selectedModuleId: UUID | null;
};

export type SubskillSelectionType = {
  isClicked: boolean;
  selectedSubSkillIndex: number | null;
  selectedSubSkillId: UUID | null;
};

/**
 * Type for setEvaluationForStudent().
 *
 * @description This intentionally omits the full details for subSkill.
 */
export type EvaluationType = {
  subSkill: SkillsType | null;
  score: number;
  module: Omit<ClassModules, "subSkills"> | null;
};

/**
 * Type for the return value of getPresentStudentsWithAssignedTasks() in the store.
 */
export type ByIdValue = StudentWithPresence["fullName"][];

/**
 * Type for non-present students, structured for both byId and byName access patterns.
 */
export type ByNameValue = { id: StudentWithPresence["id"] };

/**
 * Props for StepFourController component.
 */
export type NonPresentStudentsType = {
  byId: UniqueSet<StudentWithPresence["id"], ByIdValue>;
  byName: UniqueSet<StudentWithPresence["fullName"], ByNameValue>;
  count: number;
};

/**
 * Tuple shape used by tags UI components: [fullName, { id }]
 */
export type NonPresentStudentTuple = [
  StudentWithPresence["fullName"],
  { id: StudentWithPresence["id"] },
];

export type NonPresentStudentsResult = UniqueSet<
  StudentWithPresence["id"],
  NonPresentStudentTuple
>;

/**
 * State interface for Steps Creation Store.
 */
export interface StepsCreationState {
  /** Full class summary */
  selectedClass?: ClassSummaryDto | null;
  diplomaName?: string | null;
  className?: string | null;
  id?: UUID | null;
  /**
   * Optional description for the evaluation, can be set during the creation process or retrieved from an existing evaluation when rehydrating the store state.
   */
  description?: string | null;
  students: UniqueSet<UUID, StudentWithPresence>;
  allPresent: boolean;
  tasks: UniqueSet<UUID, ClassTasks>;
  evaluations?: unknown[] | null;
  modules: UniqueSet<UUID, ClassModules>;
  moduleSelection: ModulesSelectionType;
  subSkillSelection: SubskillSelectionType;
  /** Cached result for non-present students to preserve referential equality (key = studentId, value = student details) */
  nonPresentStudentsResult: NonPresentStudentsResult | null;
  /** Optional title for the evaluation, can be set during the creation process or retrieved from an existing evaluation when rehydrating the store state. */
  title?: string;
}

export type SelectedClassModulesReturn = ClassModules[];

export type HydrateStudentFromEvaluationPayloadArgs = Readonly<{
  studentEvaluation: DetailedEvaluationView["evaluations"][number];
  absentIds: Set<string>;
  setStudentTaskAssignment: (taskId: UUID, studentId: UUID) => void;
  setStudentPresence: (studentId: UUID, isPresent: boolean) => void;
  setStudentOverallScore: (
    studentId: UUID,
    overallScore: number | null,
  ) => void;
  getSelectedModule: (moduleId?: UUID) => ClassModules | null;
  setEvaluationForStudent: (
    studentId: UUID,
    evaluation: EvaluationType,
  ) => void;
  setSubSkillHasCompleted: (
    moduleId: UUID,
    subSkillId: UUID,
    completed: boolean,
  ) => void;
}>;

export type HydrateModulesForStudentArgs = Readonly<{
  studentId: UUID;
  modulesEvaluation: ReadonlyArray<
    DetailedEvaluationView["evaluations"][number]["modules"][number]
  >;
  getSelectedModule: (moduleId?: UUID) => ClassModules | null;
  setEvaluationForStudent: (
    studentId: UUID,
    evaluation: EvaluationType,
  ) => void;
  setSubSkillHasCompleted: (
    moduleId: UUID,
    subSkillId: UUID,
    completed: boolean,
  ) => void;
}>;
