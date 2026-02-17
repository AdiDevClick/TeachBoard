import type { UUID } from "@/api/types/openapi/common.types.ts";
import type { ClassSummaryDto } from "@/api/types/routes/classes.types.ts";
import type {
  SkillsType,
  SkillsViewDto,
} from "@/api/types/routes/skills.types.ts";
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
 * Tuple stored in the cached `nonPresentStudentsResult` UniqueSet: [fullName, { id }]
 */
export type NonPresentStudentTuple = readonly [
  StudentWithPresence["fullName"],
  { id: StudentWithPresence["id"] },
];

/**
 * State interface for Steps Creation Store.
 */
export interface StepsCreationState {
  /** Full class summary */
  selectedClass?: ClassSummaryDto | null;
  diplomaName?: string | null;
  className?: string | null;
  id?: UUID | null;
  description?: string | null;
  students: UniqueSet<UUID, StudentWithPresence>;
  tasks: UniqueSet<UUID, ClassTasks>;
  evaluations?: unknown[] | null;
  modules: UniqueSet<UUID, ClassModules>;
  moduleSelection: ModulesSelectionType;
  subSkillSelection: SubskillSelectionType;
  /** Cached result for non-present students to preserve referential equality (key = studentId, value = tuple `[fullName, { id }]`) */
  nonPresentStudentsResult: UniqueSet<UUID, NonPresentStudentTuple> | null;
} 

export type SelectedClassModulesReturn = ClassModules[];
